const express = require('express');
const router = express.Router();
const jwt = require ('jsonwebtoken'); // to generate token
const bcrypt = require ('bcryptjs'); // encrypt passwword
//check validation for requests
const {check , validationResult} = require('express-validator');
const gravatar = require('gravatar'); //get user image by email
const auth = require('../middleware/auth');
//models
const User = require('../models/User');

//getting user information from token

// @route   POST api/user
// @desc    User information
// @access  Private
router.get('/:id', auth, async(req, res)=>{
    try {
        //get user information by id
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "user not found"})
        }
        return res.status(200).json({ ...user, password: 'HHHH GOT YOU'});
    } catch (error) {
        console.log(err.message);
        return res.status(500).send('ServerError')
    }
})

// @route   POST api/user/register
// @desc    Register user . sign up . s'inscrire
// @access  Public
router.post('/register', [
    //validation
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password', 'Pllease enter a password with at least 6 characters').isLength({
        min : 6,
    }),
] , async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
        });
    }
    //get name ana email and password from request 
    const {name, email , password} = req.body;
    try{
        //check if user already exist
        let user = await User.findOne({email});
        //user exist
        if(user){
            return res.status(400).json({
                errors: [
                    {
                        msg:'User already exisits',
                    },
                ],
            });
        }

        //user doesn't exist
        //get image from gravatar (email)
        const avatar = gravatar.url(email,{
            s:'200', //size
            r: 'pg',//rate
            d:'mm',
        });

        //create user object
        user = new User({
            name,email,avatar,password
        });

        //encrypt password
        const salt = await bcrypt.genSalt(10); //generate salt contains 10
        //sace password
        user.password = await bcrypt.hash(password , salt); //use user password and salt to hash password
        //save user
        await user.save();

        //payload to generate token
        const payload = {
            user : {
                id: user._id,
                role : user.role
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,{
                expiresIn : 360000 //for development for production it will 3600 
            } , (err, token)=>{
                if(err) throw err;
                res.json({token}); 
            }
        );
    }catch(error) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

// @route   POST api/user/signin
// @desc    Sign In user
// @access  Public
router.post('/signin', [
    //validation for email and passwword
    check('email','please include a valid email').isEmail(),
    check('password','password is required').exists()
], async (req,res) => {
    //if error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.statues(400).json({
            errors : errors.array(),
        });
    }

    //if everything is good
    //get email and password from request body 
    const{email,password}=req.body;
    try {
        //find user 
        let user = await User.findOne({
            email
        });

        //if user not found in database
        if(!user){
            return res.status(400).json({
                errors : [{
                    msg : 'Invalid credentials'
                }]
            })
        }

        //now user founded by email let's compare passwords
        const isMatch = await bcrypt.compare(password , user.password);

        //passwords don't match
        if(!isMatch){
            return res.status(400).json({
                errors : [{
                    msg : 'Invalid credentials'
                }]
            })
        }

        //payload for  jwt
        const payload = {
            user : {
                id : user.id,
                role : user.role, //?????
                name : user.name ///!!!!!!!!!!!!
            }
        }
        jwt.sign(
            payload,
            process.env.JWT_SECRET,{
            expiresIn:360000
        }, (err,token)=>{
                if(err) throw err;
                res.json({
                    token
                })
            }
        )
    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router