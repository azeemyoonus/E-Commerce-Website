
var db = require('../config/connection')
var collection = require('./collections');
const bcrypt = require('bcrypt');

module.exports = {

    doLogin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let response={}
            user = await db.get().collection(collection.USER_COLLECTION).findOne({ user_email: userdata.user_email })
            if (user) {
                bcrypt.compare(userdata.user_password, user.user_password).then((status) => {
                    if (status) {
                        response.user=user;
                        response.status=true;
                     //   console.log('login success!')
                        resolve(response)
                    }
                    else {
                     //   console.log('login failed'+status);
                        resolve(response.status=false)
                    }
                })
            }
            else {
              //  console.log('login failed');
                resolve(response.status=false)
            }
        

        })

    },

    doCreate: (userdata) => {

        return new Promise(async (resolve, reject) => {
            userdata.user_password = await bcrypt.hash(userdata.user_password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
                console.log(data.ops[0]);
                resolve(true)
            })

        })






    }




}