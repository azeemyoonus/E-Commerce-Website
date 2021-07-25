
var db = require('../config/connection')
var collection = require('./collections');
const bcrypt = require('bcrypt');
const collections = require('./collections');
var Razorpay = require('razorpay');
var objectid = require('mongodb').ObjectID;
var instance = new Razorpay({ key_id: 'rzp_test_kwnIaBUPumh7LR', key_secret: '2KAtQVWDhldMDbwMawG280eN' })

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
                prodObjExist = await db.get().collection(collections.CART_COLLECTIONS).findOne({ userCart_id: objectid(user._id), products: { $elemMatch: { item: objectid(productId) } } })
                if (prodObjExist) {
                    db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(user._id), 'products.item': objectid(productId) },
                        {
                            $inc:
                                { 'products.$.quantity': 1 }
                        }).then((response) => {
                            resolve(response)
                        })
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
                db.get().collection(collections.CART_COLLECTIONS).updateOne({ userCart_id: objectid(userCartId), 'products.item': objectid(productId) },
                    {
                        $inc:
                            { 'products.$.quantity': value }
                    }).then((response) => {
                        resolve(response)
                    })

            }





        })


    },
    totalPrice: (userCartId) => {
        return new Promise(async (resolve, reject) => {
            let totalPrice = await db.get().collection(collections.CART_COLLECTIONS).aggregate([
                {
                    $match: { userCart_id: objectid(userCartId) }
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
                },
                {
                    $project:
                    {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        product: { $arrayElemAt: ["$cartProductDetails", 0] }
                    }
                },
                {
                    $project:
                    {
                        price: { $convert: { input: '$product.product_price', to: 'int' } },
                        item: 1,
                        quantity: 1,


                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        total: { $sum: { $multiply: ["$quantity", "$price"] } }
                    }
                }


            ]).toArray()

            resolve(totalPrice[0].total)

        })
    },
    addDeliveryAddress: (data) => {
        return new Promise(async (resolve, reject) => {
            let orderObj = {
                user_name: data.userName,
                userId: objectid(data.userId),
                delivery_name: data.delivery_name,
                delivery_number: data.delivery_number,
                delivery_pincode: data.delivery_pincode,
                delivery_locality: data.delivery_locality,
                delivery_area: data.delivery_area,
                delivery_state: data.delivery_state,
                delivery_district: data.delivery_district,
                delivery_landmark: data.delivery_landmark,
                delivery_altnumber: data.delivery_altnumber,
            }
            await db.get().collection(collections.ORDER_COLLECTIONS).insertOne(orderObj).then((response) => {
                resolve(response.ops[0])
            })
        })

    },
    getDeliveryAddress: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTIONS).findOne({ userId: objectid(userId) }).then((response) => {
                resolve(response)
            })
        })
    },
    generateRazorpay: (orderId, totalPrice) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: totalPrice * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId
            };
            instance.orders.create(options, function (err, order) {
                console.log(order);
                resolve({ id: order.id, amount: order.amount });
            });

        })

    },
    addOrderSummary: (id) => {
        return new Promise(async (resolve, reject) => {
            products = await db.get().collection(collections.CART_COLLECTIONS).aggregate([
                {
                    $match: { userCart_id: objectid(id) }
                },
                {
                    $project: {
                        _id: 0,
                        products: 1,
                    }

                }
            ]).toArray()
            let productSummary = products[0].products;
            final = await db.get().collection(collections.ORDER_COLLECTIONS).updateOne(
                { userId: objectid(id) },
                { $set: { summary: productSummary } })
            resolve();
        })
    },

    getSummaryStatus: (id) => {
        return new Promise(async (resolve, reject) => {
            status = await db.get().collection(collections.ORDER_COLLECTIONS).aggregate([
                {
                    $match: ({ userId: objectid(id) })
                },
                {
                    $project: {
                        _id: 0,
                        summary: 1
                    }
                }

            ]).toArray()
            console.log("checking summary Status",status);
            if (status.length!=0){
                resolve(status=true);                
            }
            else{
                reject(status=false);
            }            
        })
    }

}