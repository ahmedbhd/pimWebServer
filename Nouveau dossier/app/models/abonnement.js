var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
// Import Mongoose Validator Plugin




// User Mongoose Schema
var AbonnementSchema = new Schema({
    duree_abonnement: { type: String, required: true},
    type_abonnement: { type: String,  required: true },
    active: { type: Boolean, required: true }
   
});




module.exports = mongoose.model('Abonnement', AbonnementSchema); 