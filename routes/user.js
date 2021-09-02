var express = require("express");
var router = express.Router();
var verifyLogin = require('../middleware/user/userVerifyLogin');
var summaryStatus = require('../middleware/user/summaryStatus')
var userControllers = require('../controllers/userControllers');
var getSummaryStatus = require('../middleware/user/getSummaryStatus')


/* GET home page. */
router.get("/", userControllers.home);

router.get('/login', userControllers.login);

router.post('/user-login', userControllers.userLogin);

router.get(('/user-signup'), userControllers.usersignUp_get)

router.post('/user-signup', userControllers.userSignUp_Post);

router.get('/signout', userControllers.signOut);

router.get('/cart', verifyLogin, userControllers.cart);

router.get('/cartDetails', verifyLogin,summaryStatus, userControllers.cartDetails)

router.get('/remove-cart-product/', verifyLogin, userControllers.removeCartProduct)

router.get('/incrementProduct/', verifyLogin, userControllers.incrementProduct);

router.get('/place-order',verifyLogin,getSummaryStatus, userControllers.placeOrder)

router.get('/getdistrict', verifyLogin, userControllers.getDistrict)

router.post('/addDeliveryAddress', verifyLogin, userControllers.addDeliveryaddress)

router.post('/payment', verifyLogin, userControllers.onlinePayment)

router.post("/verifyPayment", verifyLogin, userControllers.verifyPayment);

router.post("/orderSummary", verifyLogin, userControllers.orderSummary);

router.get('/your%20orders', verifyLogin, userControllers.yourOrders);

router.post('/confirm%20order',verifyLogin, userControllers.confirmOrder);

module.exports = router;
