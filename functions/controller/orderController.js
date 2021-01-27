const order = require("../model/order")
const admin = require('firebase-admin')
// const firestore = require('fire')
const async = require('async');
const Food = require("../model/food")
const Order = require("../model/order")
const {body, validationResult} = require("express-validator");


/// food in session
//{
//  10120 : {
//     count: 1,
//     note: "",
//     toppings: []
//  },
//  ....
//}
//

//for user
exports.cart = (req, res) => {

    const order_items = req.session.cart ? req.session.cart : []
    console.log(order_items)
    //[
    //     {
    //      food: Food object
    //      order:  {
    //           count: 1,
    //           note: "",
    //           toppings: []
    //          }
    //      }
    //   , ...
    // ]
    getOrders(order_items).then(items => {

        let totalPrice = 0;
        try {
            items.forEach(item => {
                totalPrice += item.food.price * item.order.count
            })
        } catch (e) {
            console.error(e)
        }

        console.debug("Total price " + totalPrice)
        res.render('cart', {
            title: "Giỏ hàng", order_items: items,
            totalPrice: totalPrice, error: null
        })
    })

}

async function getOrders(session_order_items) {
    const db = admin.firestore();
    const value = await db.collection('food').get()

    let items = value.docs.filter((doc) => {
        if (doc.id in session_order_items) {
            return doc;
        }
    })

    items = items.map(el => {
        let food = new Food();
        food.id = el.id
        food.title = el.data().title
        food.price = el.data().price
        food.description = el.data().description
        food.image_url = el.data().image_url

        return {
            food: food,
            order: session_order_items[food.id],
        }
    })

    return items;
}

exports.add_to_cart = (req, res) => {
    const foodId = req.query.id
    const title = req.query.title
    console.debug(`foodId ${foodId}, title ${title}`)

    // adding id to session
    if (req.session.cart) {

        if (req.session.cart[foodId]) {
            req.session.cart[foodId].count += 1
        } else {
            req.session.cart[foodId] = {
                count: 1,
                note: "",
                toppings: []
            }
        }
        req.session.cart_count += 1
    } else {
        req.session.cart = {}
        req.session.cart[foodId] = {
            count: 1,
            note: "",
            toppings: []
        }
        req.session.cart_count = 1
    }
    // next()
    console.debug(`Session cart_count ${req.session.cart_count}`)
    res.send({
        cart_count: req.session.cart_count
    })
}

exports.submit_order = [
    body("fullName", "Tên đầy đủ không được để trống").trim().isLength({min: 1}),
    body("phone", "Số điện thoại không được để trống").isNumeric().trim().isLength({min: 1}),
    body("address", "Địa chỉ không được để trống").trim().isLength({min: 1}),
    (req, res, next) => {
        console.log("Submit Order")
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        //CHecking if title or content is empty
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.send(errors.array())
            next()
            return;
        }

        const session_order_items = req.session.cart

        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

        if (isEmpty(session_order_items)) {
            res.redirect("/menu")
        }

        (async function () {
            const db = admin.firestore();
            const ref = await db.collection("order").doc()
            ref.set(
                {
                    // session_order_items,
                    full_name: req.body.fullName,
                    phone: req.body.phone,
                    address: req.body.address,
                    email: req.body.email,
                    status: "WAITING"
                }
            )


            // for (const property in session_order_items) {
            //     console.log(`${property}: ${session_order_items[property]}`);
            // }
            const items = Object.keys(session_order_items).map((key) => {
                return {
                    food_id: key,
                    count: session_order_items[key].count,
                    note: session_order_items[key].note,
                    toppings: session_order_items[key].toppings,
                }
            })

            // ref.collection("food")

            console.log(items)
            const batch = db.batch()
            items.forEach((item) => {
                const docRef = db.collection("order").doc(ref.id).collection('food').doc(item.food_id)
                batch.set(docRef, item)
            })
            batch.commit().then((value) => {
                req.session.cart = {}
                delete req.session.cart_count
                res.render("submitted")
            }).catch((err) => {
                res.status(404).render("order/submit_fail", {
                    title: "Lỗi khi đặt đơn",
                    message: "Bạn hãy thử lại sau hoặc\n" +
                        " liên hệ với chúng tôi qua số điện thoại: 0962485*** hoặc email nguyen@email.com"
                });
            })


        })()

    }
]


/// for admin ///


/// Admin order list ///
exports.order_list = function (req, res) {

    res.render('admin/order_list', {title: "Danh sách đơn hàng"})

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

