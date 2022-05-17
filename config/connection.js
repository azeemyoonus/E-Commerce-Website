const mongoClient = require('mongodb').MongoClient;
const state = {
    db: null
}
module.exports.connect = function (done) {
    const url = 'mongodb+srv://azeemyoonus:Azeem%4012@cluster0.iee5t.mongodb.net/Shopping?retryWrites=true&w=majority';
    const dbname = 'Shopping';

    mongoClient.connect(url,{ useUnifiedTopology: true}, (err, data) => {
        if (err) {
             console.log("err");
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