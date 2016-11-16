var scraperjs = require('scraperjs');

var Stories = require('./models/stories.js');


function ArticleScraper(){
	//for selecting which scraper function to run on the basis of url substrings.
	this.scrape = function(){
		self = this
		Stories.find({"is_scraped" : false}, function(err, stories){
			if(err){
				console.log("Something went wrong :( \n" + err);
                   return;
			}			
			stories.forEach(function(story){
				promises = Array();
				urls = story.urls.split(",");
				urls.forEach(function(url){
					if(url.includes('ndtv'))
						promises.push(self.ndtv_scraper(url));
					else if (url.includes('timesofindia'))
						promises.push(self.toi_scraper(url));
					else if (url.includes('rediff'))
						promises.push(self.rediff_scraper(url));
					else if (url.includes('hindustantimes'))
						promises.push(self.ht_scraper(url));	
				});

				Promise.all(promises).then(function(content){
					content = content.join(". ");
					Stories.update({"_id" : story._id}, {"$set" : {"content" : content, "is_scraped" : true}}, function(err, n){
						if(err){
							console.log("Something went wrong :( \n" + err);
                    		return;
						}
						console.log("Content stored successfully.")
					});	
				})		
			});
		});
	}
	
	//scraper functions for different websites
	
	this.toi_scraper = function(url){
		return scraperjs.StaticScraper.create(url)
		.scrape(function($) {
			return $(".Normal").map(function() {
				return $(this).text();
			}).get();
		});
	};
	
	this.ht_scraper = function(url){
		return scraperjs.StaticScraper.create(url)
		.scrape(function($) {
			return $("#div_storycontent").map(function() {
				return $(this).text();
			}).get();
		});
	};
	
	this.rediff_scraper = function(url){
		return scraperjs.StaticScraper.create(url)
		.scrape(function($) {
			return $("#arti_content_n").map(function() {
				return $(this).text();
			}).get();
		});
	};
	
	this.ndtv_scraper = function(url){
		return scraperjs.StaticScraper.create(url)
		.scrape(function($) {
			return $(".ins_storybody").map(function() {
				return $(this).text();
			}).get();
		});
	};
}

module.exports = ArticleScraper;