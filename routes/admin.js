var express = require('express');
var router = express.Router();
var producthelper = require('../dbHelpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {
  var nbr=1;
producthelper.getProduct().then((products)=>{
  res.render('admin/view-products',{products,admin:true})
})


});


router.get("/add-products", (req, res) => {
  res.render('admin/add-products');
});
router.post('/add-products', (req, res) => {

  producthelper.addProduct(req.body, (id) => {
    let image =req.files.product_photo;
    image.mv("./public/product-images/"+id+".jpeg",(err)=>{
      if(!err) console.log("no error")
      else console.log("error in photo :"+err)
    })
    res.render("admin/add-products");
  });

});
 

module.exports = router;
 