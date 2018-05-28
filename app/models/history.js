var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
// Import Mongoose Validator Plugin




// User Mongoose Schema
var HistorySchema = new Schema({
    recepteur: { type: Number, required: true},
    bouquet: { type: String, required: true },
    channel: { type: String, required: true},
    program: { type: String, required: true},
    date: { type:Date, required: true}
    
    
   
});




module.exports = mongoose.model('History', HistorySchema); // Export User Model for us in API
