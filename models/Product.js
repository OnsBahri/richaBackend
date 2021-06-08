const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema ({
    
    
    name:{
        type : String,
        required : true,
    },
    image:{
        type : String,
        required : true,
    },
    price:{
        type : int,
        required : true,
    },
    description :{
        type :"String",
        required: true,
    }
})