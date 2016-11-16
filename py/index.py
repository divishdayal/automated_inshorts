from vectorize_tfidf import *
from preproc import *
from clustre import *
from summarizer import *
from utils import *

def select():
	print "Proccessing tweets"
	preproc = PreProc()
	preproc.process_tweets()
	
	print "Finding vectors"
	vectorizer = Vectorize()
	vectorizer.vectorize_news()
	vectorizer.vectorize_trends()
	
	print "Selecting Stories"
	clustre = Clustre()
	clustre.clustre_news()
	clustre.associate_tweet()

	print "Summerizing stories"
	summarizer = Summarizer()
	summarizer.summerize()
	
	print "Finished cycle"

select()
set_interval(select, 900)