var userhelper = require('../helpers/userhelpers');
var addressFormHelper = require('../helpers/addressFormHelper');
const userhelpers = require('../helpers/userhelpers');
var productHelper = require('../helpers/product-helpers');
const collections = require('../helpers/collections');
const summaryStatus = require('../middleware/user/summaryStatus');
const { response } = require('express');
const session = require('express-session');


exports.home = async (req, res, next) => {
  let user = req.session.user
  productHelper.getProduct().then(async (products) => {
    if (user) {
      await userhelper.getCartCount(user._id).then((response) => {
        count = response;
      }).catch((err) => {
        console.log(err);
      })
    }
    else count = 0;
    res.render("user/view-products", { products, admin: false, user, count });
  })
}

exports.login = (req, res) => {
  let login = req.session.loggIn
  if (login) {
    res.redirect('/')
  }
  else {
    console.log("hello>")
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
  //getting cart count 
  await userhelper.getCartCount(user._id).then((response) => {
    count = response;
  }).catch((err) => {
    console.log(err);
  })
  res.render('user/cart', { user, "cartProducts": products, totalPrice, count })
}

exports.placeOrder = async (req, res) => {
  let products = await userhelper.getCartProdDetails(user._id);
  //getting total price of all products in cart .
  totalPrice = (products.length == 0) ? totalPrice = 0 : totalPrice = await userhelper.totalPrice(user._id)
  let count = await userhelper.getCartCount(user._id);

  // getting delivery address
  let deliveryAddress = await userhelper.getDeliveryAddress(req.session.user._id)

  let summaryStatus = req.dataFromGetsummaryStatus

  console.log(summaryStatus, "summary Status");

  stateNames = await addressFormHelper.states();
  districtNames = addressFormHelper.districtNames();
  res.render('user/order-summary', {

    "user": req.session.user,
    totalPrice,
    count,
    "cartProducts": products,
    deliveryAddress,
    stateNames,
    districtNames,
    summaryStatus,

  })
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

exports.addDeliveryaddress = async (req, res) => {
  deliveryAddress = await userhelpers.addDeliveryAddress(req.body);
  res.json({ status: true })
}

exports.orderSummary = (req, res) => {

  userhelper.addOrderSummary(req.session.user._id).then((response) => {
    console.log("added order summary in orders collection", response.result);
  }).then(() => {
    return userhelper.totalPrice(req.session.user._id)
  }).then((total) => {
    return userhelper.addTotalPrice(total, req.session.user._id)
  }).then((res) => {
    console.log("added total price in orderes collection", res.result);
  }).catch((err) => {
    console.log(err);
  }).then(() => {
    return userhelper.addSummaryStatus(req.session.user._id)
  }).then((res) => {
    console.log("add summary status true", res.result);
  }).catch((err) => {
    console.log("error in adding summary status", err);
  }).then(() => {
    res.json({ status: true })
  })

}

exports.onlinePayment = async (req, res) => {
  return userhelper.totalPrice(req.session.user._id).then((total) => {
    return userhelper.generateRazorpay(req.session.user._id, total, req.session.user._id)
  }).then((response) => {
    console.log("generated receipt", response);
    res.json({ status: true, data: response, user: req.session.user });
  }).catch((err) => {
    console.error("error in generating receipt", err);
  })

}

exports.afterPayment = (req, res) => {
  let user = req.session.user._id;
  userhelper.addConfirmation(req.session.user._id, 'online').then(() => {
    return userhelper.totalPrice(req.session.user._id)
  }).then(() => {
    return userhelper.clearCart(user)
  }).then((res) => {
    console.log("Cart Cleared", res.result);
  }).then(() => {
    return userhelper.ordersToOrderHistory(user).then((res) => {
      console.log("added to ordered History", res.result)
    }).then(() => {
      res.json({ status: true, redirect: '/your%20orders' })
    })
  })
}

exports.verifyPayment = (req, res) => {

  userhelper.verifyPayment(req.body).then((response) => {
    res.send({ response });
  })

}

exports.yourOrders = async (req, res) => {
  let user = req.session.user;
  let count = await userhelper.getCartCount(user._id);
  console.log("hello");
  userhelper.getorderedDetails(user._id).then((response) => {
    res.render('user/orders', {
      user,
      count,
      "orderedDetails": response
    })
  }).catch((err) => {
    res.send(err);
  })

}

exports.confirmOrder = (req, res) => {
  let type = req.body.type;
  let user = req.session.user._id;
  if (type == 'cash') {
    // adding payment type, ordered date, deliverydate, confirmation 
    userhelper.addConfirmation(user, 'cash').then(() => {
      console.log("confirmation added");
    }).then(() => {
      return userhelper.clearCart(user)
    }).then((res) => {
      console.log("cleared cart", res.result);
    }).then(() => {
      return userhelper.ordersToOrderHistory(user)
    }).then((response) => {
      console.log("added to ordered History", response.result);
    }).then(() => {
      res.json({ status: true, redirect: '/your%20orders' })
    })
  }
  else if (type == 'online') {
    //
  }
}

exports.cancelYourOrderItm = (req, res) => {
  // console.log(req.query.prodId);
  // console.log(req.query.orderID);
  userhelper.canclOrdrItm(req.session.user._id, req.query.prodId, req.query.orderID).then((response)=>{
    // console.log(response);
  })

}