const admin = require('firebase-admin')
const async = require('async');
const {body, validationResult} = require("express-validator");
const Order = require("../model/order")

exports.profile = async function (req, res, next) {
    const uid = req.cookies.uid
    // console.log("UID", uid)
    //TODO get history and locations
    await async.parallel({
            userInfo: async function (callback) {
                const userRecord = await admin
                    .auth()
                    .getUser(uid)
                return userRecord.toJSON()
            },
            history: async function (callback) {
                const db = admin.firestore();
                const snapshot = await db.collection("order").where(
                    'uid', '==', uid
                ).get()
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return [];
                }

                return snapshot.docs.map((doc) => {
                    let order = new Order()
                    order.email = doc.data().email
                    order.full_name = doc.data().full_name
                    order.phone = doc.data().phone
                    order.status = doc.data().status
                    order.address = doc.data().address
                    order.time_created = doc.data().time_created.toDate()
                    order.total_bill = doc.data().total_bill
                    order.id = doc.id
                    order.uid = doc.data().uid
                    return order
                });
            },
            locations: function (callback) {
                setTimeout(function () {
                    callback(null, 2);
                }, 100);
            }
        }, function (err, results) {
            // results is now equals to: {one: 1, two: 2}
            if (err) {
                console.log('Error fetching user data:', err);
                next(err)
            } else {
                // console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
                res.render('account/account_profile', {
                    userInfo: results.userInfo,
                    history: results.history,
                    locations: []
                })
            }
        }
    )
}

