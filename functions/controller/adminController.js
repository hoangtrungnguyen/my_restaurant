const admin = require('firebase-admin')
const async = require('async');
const Blog = require("../model/blog");
const {body, validationResult} = require("express-validator");

exports.overview = async (req, res) => {
    const db = admin.firestore()

    const snapshot = await db.collection('order').where(
        'time_created', '<',admin.firestore.Timestamp.fromDate(new Date())
    )//.where('time_created', '>',new Date() - 1)
        .get()

    const latest_order = snapshot.docs.map((doc) => {
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
    res.render("admin/overview",{
        latest_orders: latest_order,
    })
}