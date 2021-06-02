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
  let login = req.session.loggIn
   if(login){
     res.redirect('/')
   }
   else{
    res.render('user/user-login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false;
   }
  
})

router.post(('/user-login'), (req, res) => {
  userhelper.doLogin(req.body).then((check) => {
    if (check.status) {
      req.session.loggIn=true;
      req.session.user = check.user;
      res.redirect('/login')
    }
    else {
      req.session.loginErr=true;
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
