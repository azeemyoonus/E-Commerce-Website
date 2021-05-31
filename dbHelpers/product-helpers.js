var db = require('../config/connection')

module.exports = {

    addProduct: (product,callback) => {
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log( 'your id '+ data.ops[0]._id);
            callback(data.ops[0]._id);
    })
    }

}