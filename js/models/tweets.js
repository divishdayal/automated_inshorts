var mongoose = require('mongoose');

// define the schema for tweets model
var tweetSchema = new mongoose.Schema({
    twid: {
        type: String,
        unique: true,
    },       
    body: String,
    topic: String,
    is_processed: {type: Boolean, default: false},
    is_spell_checked: {type: Boolean, default: false},
    is_vectorized: {type: Boolean, default: false},         
    created_on: { type: Date, default: Date.now }          
},{strict: true});

// create the model for tweets and expose it 
module.exports = mongoose.model('tweets', tweetSchema);