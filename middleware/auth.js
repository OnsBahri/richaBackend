//as login is working here we are making the middleware that will check if user is sign or not by checking token 
const { response } = require('express');
const jwt = require ('jsonwebtoken');

module.exports = function (req, res, next){
    //get token from header 
    const token = req.header('x-auth-token');

    //check if no token
    if (!token){
        return response.status(401).json({
            msg :'No token, auth denied'
        })
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //set user id in req.user
        req.user = decoded.user;
        next()
    } catch (error) {
        req.status(404).json({
            msg : "Token is not valid"
        })
    }
}

//we will implement categories and products 