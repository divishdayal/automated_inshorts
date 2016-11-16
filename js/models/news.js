var mongoose = require('mongoose');

// define the schema for news model
var newsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    url: String,        
    discription: String,
    is_vectorized : { type: Boolean, default: false},
    is_published : { type: Boolean, default: false},
    created_on: { type: Date, default: Date.now }     
},{strict: true});

// create the model for news and expose it 
module.exports = mongoose.model('news', newsSchema);