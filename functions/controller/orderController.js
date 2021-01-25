const order = require("../model/order")
const admin = require('firebase-admin')
// const firestore = require('fire')
const async = require('async');


//for user
exports.cart = (req, res) => {

    const order_items = req.session.cart ? req.session.cart : []
    console.log(order_items)

    res.render('cart', {title: "Giỏ hàng", order_items: order_items, error: null})
}




/// for admin ///


/// Admin order list ///
exports.order_list = function (req, res) {

    res.render('admin/order_list',{title:"Danh sách đơn hàng"})

}
// Display detail page for a specific order.
exports.order_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: Order detail: ' + req.params.id);
};

// Display Food create form on GET.
exports.order_create_get = function (req, res) {
    res.render('admin/order_create', {title: "Tạo sản phẩm mới"})
};

// Handle Food create on POST.
exports.order_create_post = [
    // Validate and santise the name field.

    // Process request after validation and sanitization.
    (req, res, next) => {

    }];

// Display Author delete form on GET.
exports.order_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Order delete GET');
};

// Handle Author delete on POST.
exports.order_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Order delete POST');
};

// Display Author update form on GET.
exports.order_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.order_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};

