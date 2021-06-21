var express = require("express");
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userhelpers = require("../helpers/userhelpers");
var userhelper = require('../helpers/userhelpers');
var verifyLogin = require('../middleware/userVerifyLogin');
var userControllers = require('../controllers/userControllers');

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user
  productHelper.getProduct().then((products) => {
    res.render("user/view-products", { products, admin: false, user });
  })
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
    res.json({ status: true })

  })
})


router.get('/cartDetails', verifyLogin, userControllers.cartDetails)

router.get('/remove-cart-product/', verifyLogin, async (req, res) => {
  await userhelpers.removeCartProduct(req.query.productId, req.query.userCartId).then((response) => {
    res.json({ status: true })
  })

})

router.get('/incrementProduct/', verifyLogin, async (req, res) => {
  await userhelpers.incrementProduct(req.query.productId, req.query.value, req.query.userCartID, req.query.currentValue)
    .then((response) => {
      res.json({ status: true })
    })

})

router.get('/place-order', verifyLogin, userControllers.placeOrder)

router.get('/getdistrict', verifyLogin, userControllers.getDistrict)

router.post('/deliveryAddress', verifyLogin, userControllers.deliveryaddress )

module.exports = router;
