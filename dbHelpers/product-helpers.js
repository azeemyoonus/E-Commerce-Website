var db = require('../config/connection')
var collections = require('../dbHelpers/collections')

module.exports = {

    addProduct: (product, callback) => {
        db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            callback(data.ops[0]._id);
        })
    },
    getProduct: () => {
        return new Promise((resolve, reject) => {
            let products = (db.get().collection(collections.PRODUCT_COLLECTION).find().toArray());
            resolve(products)

        })
    }

}