const food = require("../model/food")
const admin = require('firebase-admin')
// const firestore = require('fire')
const async = require('async');


exports.index = function (req, res) {
    const top_blogs = []
    res.render('index', {title: "Trang chủ", error: null, top_blogs: top_blogs})

}
exports.feed_back_post = async (req,res,next)=>{
    const db = admin.firestore();
    const email = req.body.email
    const full_name = req.body.full_name
    const message = req.body.message
    const uid = req.cookies.uid ? req.cookies.uid : ""
    try{
        const value = await db.collection('feed_back').doc().set({
            email: email,
            full_name: full_name,
            message: message,
            uid:uid
        })
        res.render('submitted',{
            message:"Phản hồi của bạn đã được gửi"
        })
    } catch (e) {
        res.status(400).send({
            message: "error"
        })
    }
}


/** admin **/

exports.user_list = function (req, res) {
    const user_list = []
    const listAllUsers = (nextPageToken) => {
        admin
            .auth()
            .listUsers(100, nextPageToken).then((value => {
            const users = value.users.map((e) => e.toJSON())
            if (value.pageToken) {
                // List next batch of users.
                // listAllUsers(value.pageToken);
                // this.user_list = this.user_list.append(users)
            }
            res.render('admin/user_list', {title: "Trang chủ", error: null, users: users})
        }))
    }

    // Start listing users from the beginning, 1000 at a time.
    listAllUsers();
}

exports.user_detail = function (req, res, next) {
    const db = admin.firestore();
    const uid = req.params.id


    async.parallel({
        user_auth: async function (callback) {
            const userRecord = await admin
                .auth()
                .getUser(uid)
            console.log(`Successfully fetched user data: ${userRecord.toJSON().toString()}`);

            return userRecord
        },
        user_data: async function (callback) {
            const uid = req.params.id
            const doc = await db.collection('users').doc(uid).get()

            return doc.data()
        }
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.user_auth == null) { // No results.
            const err = new Error('Không tìm thấy người dùng');
            err.status = 404;
            return next(err);
        }
        const user_auth = results.user_auth
        const user_data = results.user_data

        res.render("admin/user_detail", {
            title: `Người dùng: ${user_auth.toJSON()['displayName']}`,
            user_auth: user_auth.toJSON(),
            user_data: user_data
        })

    })
}

// POST update user
exports.user_update_post = function (req, res, next) {
    const form_data = req.body

    async.series({
        update_auth_res: async (req, res) => {
            const uid = form_data.uid
            return await admin
                .auth()
                .updateUser(uid, {
                    email: form_data.email,
                    phoneNumber: form_data.phoneNumber,
                    // emailVerified: true,
                    // password: 'newPassword',
                    displayName: form_data.displayName,
                    // photoURL: 'http://www.example.com/12345678/photo.png',
                    // disabled: true,
                })
        },
        update_data_res: async (req, res) => {
            const uid = form_data.uid
            const db = admin.firestore();
            const doc = db.collection('users').doc(uid)
            return await doc.set({
                'address': form_data.address,
                'note': form_data.note,
                'phone': form_data.phoneNumber,
                'email': form_data.email,
                'full_name': form_data.displayName
            }, {merge: true})
        }
    }, function (err, results) {
        if (err) {
            // res.locals.toasts = req.toastr.error(`${err}`, title = 'Lỗi', options = {})
            return next(err);
        }
        if (results.update_auth_res == null) { // No results.
            const err = new Error('Không tìm thấy người dùng');
            err.status = 404;
            return next(err);
        }

        res.status(200).send({message: "OK"});
    })
}


// POST Delete user
exports.user_delete_post = function (req, res) {
    res.send("Not implement")
}
// Get delete user page
exports.user_delete_get = function (req, res) {
    res.send("Not implement")
}
