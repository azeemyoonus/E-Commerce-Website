var express = require("express");
var router = express.Router();
var verifyLogin = require('../middleware/userVerifyLogin');
var userControllers = require('../controllers/userControllers');


/* GET home page. */
router.get("/", userControllers.home);

router.get('/login', userControllers.login);

router.post('/user-login', userControllers.userLogin);

router.get(('/user-signup'), userControllers.usersignUp_get)

router.post('/user-signup', userControllers.userSignUp_Post);

router.get('/signout', userControllers.signOut);

router.get('/cart', verifyLogin, userControllers.cart);

router.get('/cartDetails', verifyLogin, userControllers.cartDetails)

router.get('/remove-cart-product/', verifyLogin, userControllers.removeCartProduct)

router.get('/incrementProduct/', verifyLogin, userControllers.incrementProduct);

router.get('/place-order', verifyLogin, userControllers.placeOrder)

router.get('/getdistrict', verifyLogin, userControllers.getDistrict)

router.post('/deliveryAddress', verifyLogin, userControllers.deliveryaddress)

module.exports = router;
