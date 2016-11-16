from datetime import *
from pymongo import MongoClient
import numpy as np
import cPickle as pickle
from bson import Binary
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import *
from sklearn.cluster import *

class Vectorize(object):
	def __init__(self):
		client = MongoClient('mongodb://localhost:27017/')
		db = client['inshort']
		self.news = db['news']
		self.tweets = db['tweets']
		self.trends = db['trends']

		self.stemmer = PorterStemmer()
		self.vectorizer = TfidfVectorizer(max_df=0.5, max_features=1000, min_df=2, stop_words='english', use_idf=True)

	def vectorize_news(self):
		
		news_docs = []
		tweet_docs = []
		input_docs =[]

		now = datetime.now()
		# For some reason created_on feild shows incorrect timing in IST, so take offset of 5.30
		time_low = now - timedelta(hours=12)

		for doc in self.news.find({"created_on": {"$gt" : time_low}}):
			input_doc = []
			input_doc.append(doc['title'])
			if doc['discription'] != None:
				input_doc.append(doc['discription'])
			input_doc = ". ".join(input_doc)
			input_doc = self.stemmer.stem(input_doc)
			input_docs.append(input_doc)
			news_docs.append(doc)

		for doc in self.tweets.find({"created_on": {"$gt" : time_low}, "is_spell_checked": True}):
			input_doc = doc['body']
			input_doc = self.stemmer.stem(input_doc)
			input_docs.append(input_doc)
			tweet_docs.append(doc)

		if len(news_docs) or len(tweet_docs) > 0:

			vectors = self.vectorizer.fit_transform(input_docs)
			vectors = vectors.toarray()
	
			for i in range(len(news_docs)):
				vector = vectors[i]
				vector = Binary(pickle.dumps( vector, protocol=2)) 
				self.news.update({"title": news_docs[i]["title"]}, {"$set": {"vector": vector, "is_vectorized" : True}})

			for i in range(len(tweet_docs)):
				vector = vectors[i + len(news_docs)]
				vector = Binary(pickle.dumps( vector, protocol=2)) 
				self.tweets.update({"twid": tweet_docs[i]["twid"]}, {"$set": {"vector": vector, "is_vectorized" : True}})

	def vectorize_trends(self):
		
		now = datetime.now()
		# For some reason created_on feild shows incorrect timing in IST, so take offset of 5.30
		time_low = now - timedelta(hours=12)

		for trend in self.trends.find({"created_on": {"$gt" : time_low}}):
			vector = 0
			counter = 0
			for tweet in self.tweets.find({"created_on": {"$gt" : time_low}, "topic": trend["name"], "is_vectorized" : True}):
				tmp = self.vectorizer.transform([tweet["body"]])
				vector += tmp.toarray()
				counter += 1
			if counter != 0:
				vector = vector.reshape(-1)
				vector /= counter
				vector = Binary(pickle.dumps( vector, protocol=2)) 
				self.trends.update({"name": trend["name"]}, {"$set": {"vector": vector, "is_vectorized" : True}})


