var objectid = require('mongodb').ObjectID;
var collections = require('../../helpers/collections')
var db = require('../../config/connection')

const summaryStatus = async (req, res, next) => {
    await db.get().collection(collections.ORDER_COLLECTIONS).updateOne(
        { userId: objectid(req.session.user._id) },
        { $set: { summaryStatus: false } }
    ).then(()=>{    
        next()
    })
   
}

module.exports = summaryStatus;
