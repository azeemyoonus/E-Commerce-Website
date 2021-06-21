var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/adminControllers')


/* GET users listing. */
router.get('/', adminControllers.home);

router.get("/add-products", adminControllers.addProduct_get)

router.post('/add-products', adminControllers.addProduct_post)

router.get('/delete-product', adminControllers.deleteProduct)

router.get('/edit-products', adminControllers.editProduct_get)

router.post('/edit-products', adminControllers.editProduct_post)

module.exports = router;
