//as login is working here we are making the middleware that will check if user is sign or not by checking token 
const { response } = require('express');
const jwt = require ('jsonwebtoken');

module.exports  =isAuth=function (req, res, next){
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
};


module.exports = isAdmin = (req, res, next) => {
    if (req.user && (req.user.role=3)) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };

  module.exports = isSeller = (req, res, next) => {
    if (req.user && (req.user.role=1)) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Seller Token' });
    }
  };

  module.exports =  isSellerOrAdmin = (req, res, next) => {
    if (req.user && ((req.user.role=1) || (req.user.role=3))) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin/Seller Token' });
    }
  };

  module.exports =  mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMIAN,
  });

module.exports =  payOrderEmailTemplate = (order) => {
  return `<h1>Thanks for shopping with us</h1>
  <p>
  Hi ${order.user.name},</p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> $${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right"> $${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Shipping address</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Thanks for shopping with us.
  </p>
  `;
};
