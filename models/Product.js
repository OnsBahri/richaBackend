const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    image:{
        type : String,
        required : true,
    },
    price:{
        type :Number,
        required : true,
    },
    countInStock:{
        type : Number,
       required : true,
    },
    description :{
        type :String,
        required: true,
    },
    ratting :{
        type : Number ,
        default :-1,
        max : 5,
    },
    numReviews :{
        type : Number,
        required : true,
    }

},{
    timestamps:true
});

module.exports = mongoose.model('Product', productSchema);
