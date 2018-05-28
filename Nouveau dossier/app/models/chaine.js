var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
// Import Mongoose Validator Plugin




// User Mongoose Schema
var ChaineSchema = new Schema({
    nomchaine: { type: String, required: true, unique: true},
    picture: { type: String, required: true },
    bouquet: { type: String, required: true},
    recepteur: { type: Number, required: true}
    
   
});




module.exports = mongoose.model('Chaine', ChaineSchema); // Export User Model for us in API
