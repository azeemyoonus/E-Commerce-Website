var express = require("express");
var router = express.Router();
var productHelper= require('../dbHelpers/product-helpers');


/* GET home page. */
router.get("/", function (req, res, next) {
  
productHelper.getProduct().then((products)=>{
  res.render("user/view-products", { products, admin: false });
})
  
});

module.exports = router;
