var userhelper = require('../helpers/userhelpers');
var addressFormHelper = require('../helpers/addressFormHelper');


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