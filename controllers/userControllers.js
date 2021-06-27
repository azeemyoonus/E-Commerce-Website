var userhelper = require('../helpers/userhelpers');
var addressFormHelper = require('../helpers/addressFormHelper');
const userhelpers = require('../helpers/userhelpers');
var productHelper = require('../helpers/product-helpers');


exports.home = async (req, res, next) => {
  let user = req.session.user
  productHelper.getProduct().then((products) => {
    res.render("user/view-products", { products, admin: false, user });
  })
}

exports.login = (req, res) => {
  let login = req.session.loggIn
  if (login) {
    res.redirect('/')
  }
  else {
    res.render('user/user-login', { "loginErr": req.session.loginErr })
    req.session.loginErr = null;
  }
}

exports.userLogin = (req, res) => {
  userhelper.doLogin(req.body).then((check) => {
    if (check.status) {
      console.log("reached loggIn");
      req.session.loggIn = true;
      req.session.user = check.user;
      res.redirect('/');
    }
    else {
      req.session.loginErr = 'Invalid Username or Password';
      res.redirect('/login');
    }
  })
}

exports.cartDetails = async (req, res) => {
  let user = req.session.user
  let products = await userhelper.getCartProdDetails(user._id);
  totalPrice = (products.length == 0) ? totalPrice = 0 : totalPrice = await userhelper.totalPrice(user._id)
  let count = await userhelper.getCartCount(user._id);
  res.render('user/cart', { user, "cartProducts": products, totalPrice, count })
}

exports.placeOrder = async (req, res) => {
  let products = await userhelper.getCartProdDetails(user._id);
  totalPrice = (products.length == 0) ? totalPrice = 0 : totalPrice = await userhelper.totalPrice(user._id)
  let count = await userhelper.getCartCount(user._id);
  let deliveryAddress = await userhelper.getDeliveryAddress(req.session.user._id)
  console.log(deliveryAddress);
  stateNames = await addressFormHelper.states();
  districtNames = addressFormHelper.districtNames();
  res.render('user/order-summary', { "user": req.session.user, totalPrice, count, "cartProducts": products, deliveryAddress, stateNames, districtNames })
}

exports.getDistrict = async (req, res) => {
  await addressFormHelper.districts(req.query.statevalue);
  res.json({ status: true })
}

exports.incrementProduct = async (req, res) => {
  await userhelpers.incrementProduct(req.query.productId, req.query.value, req.query.userCartID, req.query.currentValue)
    .then((response) => {
      res.json({ status: true })
    })

}

exports.removeCartProduct = async (req, res) => {
  await userhelpers.removeCartProduct(req.query.productId, req.query.userCartId).then((response) => {
    res.json({ status: true })
  })

}

exports.cart = (req, res) => {
  let user = req.session.user
  userhelper.addToCart(user, req.query.productId).then((response) => {
    res.json({ status: true })

  })
}
exports.signOut = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

exports.usersignUp_get = (req, res) => {
  res.render('user/user-signup');
}


exports.userSignUp_Post = (req, res) => {
  userhelper.doCreate(req.body).then((checking) => {
    if (checking) {
      req.session.loggIn = true;
      req.session.user = checking;
      res.redirect('/');
    }
    else {
      console.log('signup error');
    }
  })
}

exports.deliveryaddress = async (req, res) => {
  deliveryAddress = await userhelpers.addDeliveryAddress(req.body);
  console.log(deliveryAddress)
  res.json({ status: true, deliveryAddress })
}

exports.orderSummary = (req, res) => {
  console.log("you reached here");
  res.json({ status: true });
}

exports.paymentMethod = (req, res) => {
  if (req.body.paymentMethod == 'OnlinePayment') {
    userhelper.generateRazorpay(req.body.orderId, req.body.totalPrice).then((paymentOrder) => {
      res.json({ onlinePayment: true, data: paymentOrder })
    })
  }
  else {
    res.json({ cod: true });
  }

}

exports.verifyPayment = (req, res) => {
  const crypto = require('crypto');
  let secret = '2KAtQVWDhldMDbwMawG280eN'
  let generate_signature = crypto.createHmac('sha256', secret)
    .update(req.body.paymentOrderId+"|"+req.body['response[razorpay_payment_id]'])
    .digest('hex');
 if (generate_signature== req.body['response[razorpay_signature]']){
   res.json({payment:true});
 }
  
}