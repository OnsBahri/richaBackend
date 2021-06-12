const expressAsyncHandeler = require('express-async-handler');
const express  = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');
const isSellerOrAdmin = require('../middleware/auth');
const auth = require('../middleware/auth');


//adding a new product
router.post('/add',isSellerOrAdmin,(req, res, next)=>{
    //delete champ id of the request
    delete req.body._id;
    const product = new Product({
        ...req.body ,
        //will copy diffrent info in the body of the request  and will detail every champ
    });
    
    product.save()
    .then(() => res.status(201).json({ 
        message: 'Product added!'
    }))
    .catch(error => res.status(400).json({ 
        error 
    }));
});

//listting all the products
router.use('/product/:id', (req, res, next)=> {
    Product.findOne({
      _id : req.params.id 
    }).then((product)=>{
        res.status(200).json(product);
    }).catch(
        (error)=>{
            res.status(404).json({
                error:error
            })
        }
    )
});

//returns list one product by id
router.use('/products', (req , res , next)=>{
    Product.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(404).json({ error }));
});

//updatting product by id
router.put('/:id', isSellerOrAdmin ,(req, res, next) => {
    Product.updateOne({ _id : req.params.id}, {
        ...req.body,
        _id : req.params.id
    })
    .then(()=> res.status(200).json({message : 'Product updated !'}))
    .catch(error => res.status(400).json({ error }));
});

//updatting ratting

//deletting product
router.delete('/:id',isSellerOrAdmin,(req, res, next)=>{
    Product.deleteOne({_id : req.params.id})
    .then(() => res.status(200).json({ message : 'Product have been deleted ! '}))
    .catch(error => res.status(400).json({ error }));
});



module.exports = router
