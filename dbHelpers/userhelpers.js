
var db = require('../config/connection')
var collection = require('./collections');
const bcrypt = require('bcrypt');
const collections = require('./collections');
var objectid = require('mongodb').ObjectID;


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
                prodObjExist = userHasCart.products.findIndex(product => product.item == productId)
                if (prodObjExist != -1) {
                    db.get().collection(collections.CART_COLLECTIONS).updateOne({ 'products.item': objectid(productId) },
                        {
                            $inc:
                                { 'products.$.quantity': 1 }
                        }).then((response) => {
                            resolve(response)
                        })
                    console.log("prodObjExist")
                }
                else {
                    let prodObj = {
                        item: objectid(productId),
                        quantity: 1
                    }
                    db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(user._id) },

                        {
                            $push:
                            {
                                products: prodObj
                            }
                        }).then((response) => {
                            console.log("new product added");
                            resolve(response)
                        })

                }


            }
            else {
                let proObj = {
                    item: objectid(productId),
                    quantity: 1
                }
                cartObj = {
                    userCart_id: objectid(user._id),
                    products: [proObj]
                }
                db.get().collection(collections.CART_COLLECTIONS).insertOne(cartObj).then((response) => {
                    resolve()
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
                    $unwind: "$products"
                },
                {
                    $lookup:
                    {
                        from: collections.PRODUCT_COLLECTION,
                        localField: "products.item",
                        foreignField: "_id",
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
                resolve(count)
            }

        })
    },
    removeCartProduct: (productId, userId) => {
        return new Promise((resolve, reject) => {
            console.log(productId, userId);
            db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(userId) },
                { $pull: { products: { item: { $eq: objectid(productId) } } } }
            ).then((response) => {
                resolve(response)
            })
        })
    },

    incrementProduct: (productId, value, userCartId, currentValue) => {
        return new Promise((resolve, reject) => {
            value = parseInt(value)
            if (value == -1 && currentValue == 1) {
                db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(userCartId) },
                    { $pull: { products: { item: { $eq: objectid(productId) } } } }
                ).then((response) => {
                    resolve(response)
                })

            }
            else {
                db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(userCartId),'products.item': objectid(productId) },
                    {
                        $inc:
                            { 'products.$.quantity': value }
                    }).then((response) => {
                        resolve(response)
                    })

            }





        })


    }



}