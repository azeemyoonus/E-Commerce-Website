const mongoClient = require('mongodb').MongoClient;
const state = {
    db: null
}
module.exports.connect = function (done) {
    const url = 'mongodb://localhost:27017';
    const dbname = 'shopping';

    mongoClient.connect(url,{ useUnifiedTopology: true}, (err, data) => {
        if (err) {
             console.log(err);
       }
        else {
            state.db = data.db(dbname);
            console.log("database connected");
            done(dbname)
        }
    })
}
module.exports.get = function () {
    return state.db;
}