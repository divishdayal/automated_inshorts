import nltk
import enchant
import preprocessor as p
import re
from nltk import word_tokenize
from nltk.metrics import edit_distance
from pymongo import MongoClient


class PreProc(object):
	def __init__(self):
		client = MongoClient('mongodb://localhost:27017/')
		db = client['inshort']
		self.tweets = db['tweets']

		self.spell_dict = enchant.Dict("en")
		self.max_dist = 4

	def replace(self, word):
		if self.spell_dict.check(word):
			return word
		suggestions = self.spell_dict.suggest(word)
	
		if suggestions and edit_distance(word, suggestions[0]) < self.max_dist+1:
			return suggestions[0]
		else:
			return word

	def process_tweets(self):
		w1 = [] #Temporary list to hold words of a tweet
		allwords = [] #Container for word storage
		p.set_options(p.OPT.URL)
		#First Pass
		for tweet in self.tweets.find({"is_processed":False}):
			w1 = tweet['body'].split()
			w2 = []
			for word in w1:
				if(word[0] == '#' or word[0] == '@'):
					tmp = word[1:]
					splitted = re.sub('(?!^)([A-Z][a-z]+)', r' \1',tmp).split()
					for newwords in splitted:
						w2.append(newwords)
				else:
					w2.append(word)
				tweet2 = ''
			for word in w2:
				tweet2 = tweet2 + ' ' + word
			tweet2 = tweet2[1:]
			tmp = p.clean(tweet2)
			tmp2 = tmp.split()
			tmp = ''
			for words in tmp2:
				#print words
				tmp = tmp + ' ' + words		
				allwords.append(words)
			tmp = tmp[1:]
			self.tweets.update({"twid": tweet['twid']}, {'$set' : {'body' : tmp, 'is_processed' : True}})

		fd = nltk.FreqDist(allwords)

		for tweet in self.tweets.find({"is_processed" : True, "is_spell_checked" : False}):
			w1 = word_tokenize(tweet['body'])
			w2 = []
			for words in w1:
				if (fd[words] < 10):
					w2.append(self.replace(words))
			tweet2 = ''
			for word in w2:
				tweet2 = tweet2 + ' ' + word
			tweet2 = tweet2[1:]
			self.tweets.update({'twid': tweet['twid']}, {'$set' : {'body' : tweet2, 'is_spell_checked' : True}})
