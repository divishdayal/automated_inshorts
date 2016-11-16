var parser = require('parse-rss');

var urls = require('./config/rss_urls.js');

var News = require('./models/news.js');

function NewsFetcher(){

    //News fetcher
    this.getNews = function(){
        var self = this;
        for(i = 0; i<urls.length; i++){
            parser(urls[i], function(err, rss){
                if(err){
                    console.log("Something went wrong :( \n" + err);
                    return;
                }else{
                    for(j=0; j<rss.length; j++){
                        data = self.formatNews(rss[j]);
                        self.saveNews(data);                        
                    }
                }
            });        
        }
    };

    //Format a raw news
    this.formatNews = function(news){
        var newsSchema = {
            title: news['title'],
            url: news['link'],
            discription: news['description']
        }
        return News(newsSchema);
    };

    //Create a new model instance with our object
    this.saveNews = function(news){
        news.save(function(err, data) {
            if (err) {
                console.log("Something went wrong :(  \n" + err);
                return;
            } else {
                console.log('News successfully stored.');
            }
        });       
    };

}

module.exports = NewsFetcher;
