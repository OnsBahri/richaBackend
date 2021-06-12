const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderItem:[{
    name : {
      type :String,
      required : true,
    },
    qty :{
      type:Number,
      requird:true,
    },
    image:{
      type:String,
      required:true,
    },
    price:{
      type:Number,
      required:true,
    },
    product:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Product',
      required:true,
    },
  }],
  shippingAdress : {
    fullName : {
      type:String,
      required:true,
    },
    adress : {
      type:String,
      required:true,
    },
    city : {
      type:String,
      required:true,
      default:"Tunis"
    },
    postalCode : {
      type:String,
      required:true,
    },
    country: {
      type:String,
      required:true,
      default : "Tunisie"
    },
  },
  payementMethod :{
    type:String,
    required:true,
  },
  paymentResult:{
    id:String,
    status:String,
    update_time:String,
    email_adress:String,
  },
  itemPrice: {
    type:Number,
    required:true,
  },
  shippingPrice: {
    type:Number,
    required:true,
    default: 8
  },
  taxPrice:{
    type:Number,
    required:true
  },
  totalPrice: {
    type:Number,
    required:true,
  },
  user:{
    type : mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User',
  },
  seller:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  isPaid:{
    type: Boolean,
    default:false,
  },
  paidAt:{
    type:Date,
  },
  isDelivered:{
    type: Boolean,
    default:false,
  },
  deliveredDate:{
    type:Date,
  }

},{
  timestamps:true,
})

/*const orderSchema = new mongoose.Schema({
  cart:{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  user :{
    type : mongoose.Schema.Types.ObjectId,
    ref :'User',
  },
  total :{
    type : Number,
    default : 0,
  },
  updated : Date,
  created:{
    type :Date,
    default : Date.now,
  }
});*/

module.exports = mongoose.model('Order', orderSchema);