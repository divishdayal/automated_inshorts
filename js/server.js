var mongoose = require('mongoose'),
    express = require('express');

var Stories = require('./models/stories.js');


function Server(){

	this.getStories = function(req, res){
		Stories.find({"is_ready" : true}, function(err, stories){
			if(err){
				res.send(err); 
				return;
			}
			res.json({stories}); 
		});
	};

	this.startExpressServer = function(){
	    app = express();
	    //All static file
	    app.use(express.static('../static/'));
    	
	    //For landing
	    app.get('/', function(req, res){
	        res.render('../static/index.html');
	    })
    	
	    //To get tweets json
	    app.get('/get_stories', this.getStories);
	
	    //Port number
	    app.listen(8080, function () {
	      console.log('Listening on port 8080!');
	    });
	}	
}

module.exports = Server;