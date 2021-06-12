const express = require('express');
const Mailgun = require('mailgun-js');
const expressAsyncHandler = require('express-async-handler');
const isAdmin =require('../middleware/auth');
const isAuth =require('../middleware/auth');
const isSellerOrAdmin =require('../middleware/auth');
const mailgun =require('../middleware/auth');
const payOrderEmailTemplate =require('../middleware/auth');

const router = express.Router();

const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');



router.get('/',isAuth,isSellerOrAdmin,async(req, res) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};

    const orders = await Order.find({ ...sellerFilter }).populate(
      'user',
      'name'
    );
    res.send(orders);
  });


router.get('/summary',isAuth,isAdmin,expressAsyncHandler( async(req, res) => {
      const orders = await Order.aggregate([
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
          },
        },
      ]);
      const users = await User.aggregate([
        {
          $group: {
            _id: null,
            numUsers: { $sum: 1 },
          },
        },
      ]);
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const productCategories = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);
      res.send({ users, orders, dailyOrders, productCategories });
    }));


router.get('/mine',isAuth,expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
})
);

router.post('/', isAuth,expressAsyncHandler(async(req,res)=>{
    //chacking if oreder item contain item or not
    if(req.body.orderItems.lenght === 0){
        res.status(400).send({
            message : 'Cart is empty'
        });
    } else{
        const order = new Order({
            seller:req.body.orderItems[0].seller,
            orderItems : req.body.orderItems,
            shippingAdress : req.body.shippingAdress,
            payementMethod : req.body.payementMethod,
            itemsPrice : req.body.itemsPrice,
            shippingPrice : req.body.shippingPrice,
            taxPrice : req.body.taxPrice,
            totalPrice : req.body.totalPrice,
            user : req.user._id,
    });
    const createOrder = await order.save();
    res.status(201).send({
        message : 'New order have been created', 
        order : createOrder
    })
}
}));


router.get('/:id',isAuth, expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

 router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        const deleteOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deleteOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );
  
  router.put(
    '/:id/deliver',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
  
        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );
  
router.put('/:id/pay',isAuth, expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id).populate('user','email name');
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        Mailgun()
          .messages()
          .send(
            {
              from: 'Richa <Richa@mg.yourdomain.com>',
              to: `${order.user.name} <${order.user.email}>`,
              subject: `New order ${order._id}`,
              html: payOrderEmailTemplate(order),
            },
            (error, body) => {
              if (error) {
                console.log(error);
              } else {
                console.log(body);
              }
            }
          );
        res.send({ 
            message: 'Order Paid',
            order: updatedOrder });
      } else {
        res.status(404).send({ 
            message: 'Order Not Found' });
      }
    }));
  


module.exports = router