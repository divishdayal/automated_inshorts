import gensim.models as g
from pymongo import MongoClient
import numpy as np
import cPickle as pickle
from bson import Binary

class Vectorize(object):
	def __init__(self):
		client = MongoClient('mongodb://localhost:27017/')
		db = client['inshort']
		self.news = db['news']
		self.tweets = db['tweets']

		self.model="dataset/model.bin"
		self.model = g.Doc2Vec.load(self.model)

		self.start_alpha=0.01
		self.infer_epoch=1000

	def vectorizeNews(self):
	
		docs = []
		vectors = []
		for doc in self.news.find({"is_vectorized" : False}):
			input_doc = []
			input_doc.append(doc['title'])
			if doc['discription'] != None:
				input_doc.append(doc['discription'])
			input_doc = ". ".join(input_doc)
			input_docs.append(input_doc)
			input_doc = input_doc.strip().split()
			vector = self.model.infer_vector(input_doc, alpha=self.start_alpha, steps=self.infer_epoch)
			vector = Binary( pickle.dumps( vector, protocol=2) ) 
			vectors.append(vector)
			docs.append(doc)
		
		for i in range(len(docs)):
			vector = vectors[i]
			vector = Binary(pickle.dumps( vector, protocol=2)) 
			self.news.update({"title": docs[i]["title"]}, {"$set": {"vector": vector, "is_vectorized" : True}})


vectorizer = Vectorize()
vectorizer.vectorizeNews()
