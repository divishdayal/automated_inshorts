var mongoose = require('mongoose');

// define the schema for trends model
var storiesSchema = new mongoose.Schema({
    title: String,
    urls: String,        
    content: String,
    is_ready: { type: Boolean, default: false},
    is_scraped: { type: Boolean, default: false},
    created_on: { type: Date, default: Date.now }     
},{strict: true});

// create the model for stories and expose it 
module.exports = mongoose.model('stories', storiesSchema);