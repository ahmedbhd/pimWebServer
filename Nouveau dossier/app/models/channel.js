var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
// Import Mongoose Validator Plugin




// User Mongoose Schema
var channelSchema = new Schema({
    bouquet: { type: String, required: true, unique: true},
    name: { type: String,  required: true },
    current_program: { type: String, required: true },   
});




var Channels = module.exports = mongoose.model('channel', channelSchema); // Export User Model for us in API
module.exports.getChannelByName = function(n,callback, limit){
    var querry={name:n};
    Channels.find(querry,callback).limit(limit);
}

