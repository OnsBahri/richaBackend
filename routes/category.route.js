const express =require('express');
const router = express.Router();
const Category = require('../models/Category.js');
//for private routes
const auth = require('../middleware/auth');
const adminAuth= require ('../middleware/adminAuth');

const {check , validationResult} =require ('express-validator');

// @route   POST api/category
// @desc    Create Category
// @access  Private Admin
router.post('/',[
    check('name','Name is required').trim().not().isEmpty()
], auth,adminAuth , async(req,res)=>{
    res.send('ok')
})
module.export = router  