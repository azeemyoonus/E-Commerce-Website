var express = require("express");
var router = express.Router();
var productHelper = require('../dbHelpers/product-helpers');
var userhelper = require('../dbHelpers/userhelpers')


/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user
  productHelper.getProduct().then((products) => {
    res.render("user/view-products", { products, admin: false, user });
  })

});

router.get('/login', (req, res) => {
  let user = req.session.user
  res.render('user/user-login', { user })
})

router.post(('/user-login'), (req, res) => {
  userhelper.doLogin(req.body).then((check) => {
    if (check.status) {
      req.session.user = check.user;
      // console.log(req.session.user)
      res.redirect('/')
    }
    else {
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
module.exports = router;
