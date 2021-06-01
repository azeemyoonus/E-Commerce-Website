var express = require("express");
var router = express.Router();
var productHelper = require('../dbHelpers/product-helpers');
var userhelper = require('../dbHelpers/userhelpers')


/* GET home page. */
router.get("/", function (req, res, next) {

  productHelper.getProduct().then((products) => {
    res.render("user/view-products", { products, admin: false });
  })

});

router.get('/login', (req, res) => {
  res.render('user/user-login')
})

router.post(('/user-login'), (req, res) => {
  userhelper.doLogin(req.body).then((check) => {
   if(check.status){
     res.redirect('/')
   }
   else{
     res.redirect('/login');
   }
  })
})


router.get(('/user-signup'), (req, res) => {
  res.render('user/user-signup');
})

router.post('/user-signup',(req,res)=>{
 userhelper.doCreate(req.body).then((checking)=>{
   if(checking){
     res.redirect('/');
   }
   else{
     console.log('signup error');
   }
 })
})
module.exports = router;
