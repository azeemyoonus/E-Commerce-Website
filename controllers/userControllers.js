var userhelper = require('../helpers/userhelpers');
var addressFormHelper = require('../helpers/addressFormHelper');
const userhelpers = require('../helpers/userhelpers');


exports.cartDetails= async (req,res)=>{
  let user = req.session.user
  let products = await userhelper.getCartProdDetails(user._id);
  if (products.length==0){
    res.send('Your cart is empty')
  }
  else{
  let totalPrice = await userhelper.totalPrice(user._id);
  let count = await userhelper.getCartCount(user._id);
  res.render('user/cart', { user, "cartProducts": products, totalPrice, count })
}
}

exports.placeOrder = async (req, res) => {
  let totalPrice = await userhelper.totalPrice(user._id);
  let count = await userhelper.getCartCount(user._id);
  let products = await userhelper.getCartProdDetails(user._id);
  stateNames = await addressFormHelper.states();
  districtNames = addressFormHelper.districtNames();
  res.render('user/order-summary', { "user": req.session.user, totalPrice, count, "cartProducts": products, stateNames, districtNames })
}

exports.getDistrict = async (req, res) => {
  await addressFormHelper.districts(req.query.statevalue);
  res.json({ status: true })
}

exports.deliveryaddress= (req,res)=>{
  userhelpers.addDeliveryAddress(req.body);
}

exports.orderSummary=(req,res)=>{
  console.log("you reached here");
  res.json({status:true});
}