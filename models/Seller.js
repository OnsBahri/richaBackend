const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    badge : {},
    description : {
        type : String,
        required :true,
    },
    verified: {
        type : String,
        required : true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }
},{
    timestamps:true
});
module.exports = mongoose.model('Seller' , sellerSchema)