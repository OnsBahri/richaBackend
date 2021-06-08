const router = require("express").Router();
const auth = require('./auth.route');
const category = require('./category.route');

router.use('/user/', auth);
// router.use('/category/', category);

module.exports = router;