const mongoose = require('mongoose');

const user = require('./User');

const FournisseurSchema = new mongoose.Schema({
    badge : {},
    description : {
        type : String,
        required :true,
    },
    justificatif_pro : {
        type : String,
        required : true,
    },

});
module.exports = Fournisseur = mongoose.model('Fournisseur' , FournisseurSchema)