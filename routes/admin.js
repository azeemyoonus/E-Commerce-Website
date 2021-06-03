var express = require('express');
var router = express.Router();
var producthelper = require('../dbHelpers/product-helpers');


/* GET users listing. */
router.get('/', function (req, res, next) {

  producthelper.getProduct().then((products) => {
    res.render('admin/view-products', { products, admin: true })
  })
});



router.get("/add-products", (req, res) => {

  res.render('admin/add-products');
});
router.post('/add-products', (req, res) => {

  producthelper.addProduct(req.body, (id) => {
    let image = req.files.product_photo;
    image.mv("./public/product-images/" + id + ".jpeg", (err) => {
      if (!err) console.log("no error")
      else console.log("error in photo :" + err)
    })
    res.redirect("/admin");
  });

});

router.get('/delete-product',(req,res)=>{
  let id= req.query.id;
  producthelper.deleteProduct(id).then(()=>{
    res.redirect('/admin')
  })

})
router.get('/edit-products',(req,res)=>{
  let id =req.query.id;
  producthelper.getOneProduct(req.query.id).then((productDetails)=>{
    console.log(productDetails)
    res.render('admin/edit-product',{productDetails,id});
  })
  
})

router.post('/edit-products',(req,res)=>{
  let id =req.query.id;

  producthelper.editProduct(req.body,id).then(()=>{
    if (req.files.product_photo){
      let image = req.files.product_photo;
      image.mv("./public/product-images/" + id + ".jpeg")
    }
    res.redirect('/admin')
  })
})

module.exports = router;
