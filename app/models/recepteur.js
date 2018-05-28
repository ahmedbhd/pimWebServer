var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; 




// User Mongoose Schema
var RecepteurSchema = new Schema({
    id_rec: { type: String, required: true, unique: true},
    client: { type: String, required: true },
    fam_region: { type: String, required: true},
    fam_size: { type: String, required: true},
    fam_age: { type : String, required: true}

   
});




module.exports = mongoose.model('Recepteur', RecepteurSchema); // Export User Model for us in API
