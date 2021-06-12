const router = require('express').Router();
const auth = require('./auth.route');
const category = require('./category.route');
const order = require('./order.route');
const product = require('./product.router');


router.use('/user/', auth);
router.use('/product/', product);
router.use('/order/',order);
// router.use('/category/', category);

module.exports = router;
