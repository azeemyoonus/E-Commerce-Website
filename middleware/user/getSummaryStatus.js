var objectid = require('mongodb').ObjectID;
var collection = require('../../helpers/collections')
var db = require('../../config/connection')

let getSummaryStatus = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        status = await db.get().collection(collection.ORDER_COLLECTIONS).aggregate([
            { $match: { userId: objectid(req.session.user._id) } },
            {
                $project: {
                    _id: 0,
                    summaryStatus: 1,
                }
            }
        ]).toArray()        
        if (status.length==0) {
            req.dataFromGetsummaryStatus = false
            next()
        }
        else {
            req.dataFromGetsummaryStatus = status[0].summaryStatus;
            next()
        }


    })
}

module.exports = getSummaryStatus;
