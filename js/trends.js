var Twitter = require('twitter');

var credentials = require('./config/twitter_cred.js'),
    woeid = require('./config/woeid.js');

var Trends = require('./models/trends.js');


function TrendsFetcher(){
    this.client = new Twitter(credentials);  

    //Trends fetcher
    this.getTrends = function(){
        var self = this;
        this.client.get('trends/place', {id: woeid }, function(err, data, response) {
            if(err){
                console.log("Something went wrong :( \n" + err);
                return;
            }
            data[0].trends.forEach(function(data){
                data = self.formatTrend(data);
                self.saveTrend(data);
            });
        });
    };

    //Format a raw trend
    this.formatTrend = function(trend){
        var trendSchema = {
            name: trend['name'],
            query: trend['query']
        }
        return Trends(trendSchema);
    };

    //Create a new model instance with object
    this.saveTrend = function(trend){
        trend.save(function(err, data) {
            if (err) {
                console.log("Something went wrong :(  \n" + err);
                return;
            } else {
                console.log('Trend successfully stored.');
            }
        });       
    };
}

module.exports = TrendsFetcher;