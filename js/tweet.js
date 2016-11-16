var Twitter = require('twitter');

var credentials = require('./config/twitter_cred.js');

var Trends = require('./models/trends.js'),
    Tweets = require('./models/tweets.js');

function TweetsFetcher(){
    this.client = new Twitter(credentials);
    
    //Format a raw tweet
    this.formatTweet = function(tweet, topic){
        var tweetSchema = {
            twid: tweet['id'],
            body: tweet['text'],
            topic: topic
        }
        return Tweets(tweetSchema);
    }

    //Create a new model instance with object
    this.saveTweet = function(tweet){
        tweet.save(function(err, data) {
            if (err) {
                console.log("Something went wrong :(  \n" + err);
                return;
            } else {
                console.log('Tweet successfully stored.');
            }
        });       
    };

    //Tweet fetcher
    this.getTweets = function(){
        var self = this;
        //Get trends from Db
        var dateLowerBound = new Date();
        dateLowerBound.setMinutes(dateLowerBound.getMinutes() - 15);

        Trends.find({"created_on": {"$gte": dateLowerBound}}, function(err, trends){
            if(err) {
                console.log("Something went wrong :(  \n" + err);
                return;    
            }else{
                trends.forEach(function(data){
                    self.client.get('search/tweets', {q: data.query, lang: "en"}, function(err, tweets, response) {
                        if(err){
                            console.log("Something went wrong :( \n" + err);
                            return;
                        }
                        tweets.statuses.forEach(function(tweet){
                            tweet = self.formatTweet(tweet, data.name);
                            self.saveTweet(tweet);
                        });                        
                    });
                });
            }
        });  
    };
}

module.exports = TweetsFetcher;