var db = require('../config/connection')
var collections = require('../helpers/collections')
var objectid = require('mongodb').ObjectID;

module.exports = {

    addProduct: (product, callback) => {
        db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            console.log(data.ops[0]);
            callback(data.ops[0]._id);
        })
    },
    getProduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await (db.get().collection(collections.PRODUCT_COLLECTION).find().toArray());
            resolve(products)

        })
    },
    deleteProduct: (productid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({ _id: objectid(productid) })
                .then((response) => {
                    resolve(response)
                })
        })
    },
    getOneProduct: (productid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: objectid(productid) })
                .then((productdetails) => {
                    resolve(productdetails)
                })
        })
    },
    editProduct: (productDetails,id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION)
                .updateOne({ _id: objectid(id) }, {
                    $set:
                    {
                        product_name: productDetails.product_name,
                        product_price: productDetails.product_price,
                        product_description: productDetails.product_description,
                        product_price: productDetails.product_price,
                    }

                }).then((response)=>{
                    console.log(productDetails)
                    resolve(response)
                })
        })
    }

}