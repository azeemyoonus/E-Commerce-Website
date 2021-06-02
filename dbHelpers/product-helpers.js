var db = require('../config/connection')
var collections = require('../dbHelpers/collections')
var objectid= require('mongodb').ObjectID;

module.exports = {

    addProduct: (product, callback) => {
        db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            callback(data.ops[0]._id);
        })
    },
    getProduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await (db.get().collection(collections.PRODUCT_COLLECTION).find().toArray());
            resolve(products)

        })
    },
    deleteProduct:(productid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:objectid(productid) }).then((response)=>{
                resolve(response)
            })
        })
    }

}