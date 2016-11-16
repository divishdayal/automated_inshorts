var mongoose = require('mongoose');

// define the schema for trends model
var trendsSchema = new mongoose.Schema({
    name: String,        
    query: String,
    created_on: { type: Date, default: Date.now }     
},{strict: true});

// create the model for trends and expose it 
module.exports = mongoose.model('trends', trendsSchema);