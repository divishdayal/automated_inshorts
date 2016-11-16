from datetime import *
from pymongo import MongoClient
from sklearn.cluster import *
from sklearn.metrics import silhouette_score
import numpy as np
import ast
import cPickle as pickle
from bson import Binary
import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import cosine_similarity

class Clustre(object):
	def __init__(self):
		client = MongoClient('mongodb://localhost:27017/')
		db = client['inshort']
		self.news = db['news']
		self.tweets = db['tweets']
		self.trends = db['trends']
		self.stories = db['stories']

	def clustre_news(self):
		docs = []
		vectors = []
		best_score = -1

		now = datetime.now()
		# For some reason created_on feild shows incorrect timing in IST, so take offset of 5.30
		time_low = now - timedelta(hours=12)

		for doc in self.news.find({"created_on": {"$gt" : time_low}, "is_vectorized" : True}):
			vector = pickle.loads(doc['vector'])
			vectors.append(vector)
			docs.append(doc)

		if len(docs) > 0:		
			vectors = np.array(vectors)
			vectors = vectors.reshape((vectors.shape[0], -1))
	
			n_range = range(len(docs) * 1 / 4, len(docs) * 3 / 4)
	
			for n in n_range:
				kmeans = KMeans(n_jobs = -1, n_clusters=n).fit(vectors)
				predications = kmeans.predict(vectors) 
				score = silhouette_score(vectors, predications) 
				if score > best_score:
					best_score = score
					labels = predications
					self.kmeans = kmeans
	
			labels = labels.tolist()
	
			for i in range(len(docs)):
				self.news.update({"title": docs[i]["title"]}, {"$set": {"clustre": labels[i]}})

	def associate_tweet(self):
		now = datetime.now()
		# For some reason created_on feild shows incorrect timing in IST, so take offset of 5.30
		time_low = now - timedelta(hours=12)
		for trend in self.trends.find({"created_on": {"$gt" : time_low}, "is_vectorized" : True}):
			urls = []
			trend['vector'] = pickle.loads(trend['vector'])
			for doc in self.news.find({"created_on": {"$gt" : time_low}, "is_published": False}):
				doc['vector'] = pickle.loads(doc['vector'])
				sim = cosine_similarity(trend["vector"].reshape((1, -1)), doc["vector"].reshape((1, -1)))
				sim = sim[0][0]
				if sim > 0.07:
					urls.append(doc["url"])
					self.news.update({"title": doc["title"]}, {"$set": {"is_published": True}})
			if len(urls) > 0:
				self.stories.insert({"urls" : urls, "is_scraped": False, "is_ready": False})



