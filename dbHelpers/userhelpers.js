
var db = require('../config/connection')
var collection = require('./collections');
const bcrypt = require('bcrypt');
const collections = require('./collections');
var objectid = require('mongodb').ObjectID;
const { response } = require('express');


module.exports = {

    doLogin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            user = await db.get().collection(collection.USER_COLLECTION).findOne({ user_email: userdata.user_email })
            if (user) {
                bcrypt.compare(userdata.user_password, user.user_password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    }
                    else {
                        resolve(response.status = false)
                    }
                })
            }
            else {
                resolve(response.status = false)
            }
        })
    },

    doCreate: (userdata) => {

        return new Promise(async (resolve, reject) => {
            userdata.user_password = await bcrypt.hash(userdata.user_password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
                console.log(data);
                resolve(data.ops[0])
            })

        })

    },
    addToCart: (user, productId) => {
        return new Promise(async (resolve, reject) => {
            let userHasCart = await db.get().collection(collections.CART_COLLECTIONS).findOne({ userCart_id: objectid(user._id) });
            if (userHasCart) {
                db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(user._id) },
                    {
                        $push: {
                            products: objectid(productId)
                        }
                    })
                resolve()
            } else {
                cardObj = {
                    userCart_id: objectid(user._id),
                    products: [objectid(productId)]
                }
                db.get().collection(collections.CART_COLLECTIONS).insertOne(cardObj).then((response) => {
                    resolve(response)
                })
            }
        })
    },

    getCartProdDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartProductDetails = await db.get().collection(collections.CART_COLLECTIONS).aggregate([
                {
                    $match: { userCart_id: objectid(userId) }
                },
                {
                    $lookup:
                    {
                        from: collections.PRODUCT_COLLECTION,
                        let: { productList: "$products" },
                        pipeline: [
                            {
                                $match: {
                                    $expr:
                                    {
                                        $in: ["$_id", "$$productList"]
                                    }
                                }
                            }
                        ],
                        as: "cartProductDetails"
                    }
                }
            ]).toArray()
            resolve(cartProductDetails)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collections.CART_COLLECTIONS).findOne({ userCart_id: objectid(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    }



}