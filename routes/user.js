var express = require("express");
var router = express.Router();
var productHelper = require('../dbHelpers/product-helpers');
var userhelper = require('../dbHelpers/userhelpers');
var verifyLogin = require('../middleware/userVerifyLogin');

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user
  // let cartCount = null

  // if (req.session.cartCount) {
  //   cartCount = await userhelper.getCartCount(req.session.user._id)
  //   req.session.cartCount = cartCount
  // }



  productHelper.getProduct().then((products) => {
    res.render("user/view-products", { products, admin: false, user });
  })
  // console.log(cartCount);
});

router.get('/login', (req, res) => {
  let login = req.session.loggIn
  if (login) {
    res.redirect('/')
  }
  else {
    res.render('user/user-login', { "loginErr": req.session.loginErr })
    req.session.loginErr = null;
  }

})

router.post(('/user-login'), (req, res) => {
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
})


router.get(('/user-signup'), (req, res) => {
  res.render('user/user-signup');
})

router.post('/user-signup', (req, res) => {
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
})

router.get('/signout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart', verifyLogin, (req, res) => {
  let user = req.session.user

  userhelper.addToCart(user, req.query.productId).then((response) => {
    // console.log(response);
    res.redirect('/')
  })


})

router.get('/cartDetails', verifyLogin, async (req, res) => {
  let user = req.session.user
  // let cartCount = req.session.cartCount
  let products = await userhelper.getCartProdDetails(user._id);
  //console.log(products);
  res.render('user/cart', { user, "cartProducts": products[0].cartProductDetails })
})

module.exports = router;
