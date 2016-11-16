var mongoose = require('mongoose');

var configDB = require('./config/database.js');

var NewsFetcher = require('./news.js'),
	TrendsFetcher = require('./trends.js'),
	TweetsFetcher = require('./tweet.js'),
	ArticleScraper = require('./scraper.js'),
	Server = require('./server.js');

mongoose.connect(configDB.url);

newsFetcher = new NewsFetcher();
trendsFetcher = new TrendsFetcher();
tweetsFetcher = new TweetsFetcher();
scraper = new ArticleScraper();
server = new Server();

server.startExpressServer();

newsFetcher.getNews();
trendsFetcher.getTrends();
tweetsFetcher.getTweets();
scraper.scrape();

//Loop
setInterval(function(){
    newsFetcher.getNews();
	trendsFetcher.getTrends();
	tweetsFetcher.getTweets();
	scraper.scrape();
}, 900000);
