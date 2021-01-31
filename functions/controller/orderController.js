const order = require("../model/order")
const admin = require('firebase-admin')
// const firestore = require('fire')
const async = require('async');
const Food = require("../model/food")
const Order = require("../model/order")
const {body, validationResult} = require("express-validator");


/// food in cart session
//  {
//      orderId : {
//          foodId: 111
//          count: 1,
//          note: "",
//          orderId: orderId,
//          name: "name",
//          price: '10000'
//          toppings: [
//                  {
//                      topping_id: 'ID',
//                      topping_name: 'name',
//                      topping_price: '100000'
//                  },
//                  ...
//              ]
//        },
//      ....
//  }
//

//for user
exports.cart = (req, res) => {

    const order_items = req.session.cart ? req.session.cart : []
    console.log(order_items)
    // after call function getOrders
    //  [
    //     {
    //      order_bill: 15000,
    //      bill_per_item: 5000,
    //      food: Food object,
    //      order:  {
    //          foodId: 111,
    //           orderId: "",
    //           count: 3,
    //           note: "",
    //           name: "name",
    //           price: 5000,
    //           toppings: []
    //          }
    //      }
    //   , ...
    //  ]
    getOrders(order_items).then(items => {

        let totalPrice = 0;
        try {
            items.forEach(item => {
                totalPrice += item.order_bill
            })
        } catch (e) {
            console.error(e)
        }

        console.debug("Total price " + totalPrice)
        res.render('cart', {
            title: "Giỏ hàng",
            order_items: items,
            totalPrice: totalPrice, error: null
        })
    })

}

async function getOrders(cart) {
    const db = admin.firestore();
    const value = await db.collection('food').get()
    let foodIds = []

    for (const pro in cart) {
        if (cart.hasOwnProperty(pro))
            foodIds.push(cart[pro].foodId.toString())
    }

    let items = value.docs.filter((doc) => {
        if (foodIds.includes(doc.id.toString())) {
            return doc;
        }
    })
    //items from firebase
    items = items.map(el => {
        let food = new Food();
        food.id = el.id
        food.title = el.data().title
        food.price = el.data().price
        food.description = el.data().description
        food.image_url = el.data().image_url

        return food
    })
    const result = []
    for (const pro in cart) {
        if (cart.hasOwnProperty(pro)) {
            let food = items.find(e => {
                return e.id.toString() === cart[pro].foodId.toString()
            })
            let order_bill = 0
            for (let i = 0; i < cart[pro].toppings.length; i++) {
                order_bill += parseInt(cart[pro].toppings[i].topping_price) * parseInt(cart[pro].count)
            }
            order_bill += parseInt(cart[pro].price) * parseInt(cart[pro].count)
            result.push({
                order_bill: order_bill,
                bill_per_item: order_bill / cart[pro].count,
                food: food,
                order: cart[pro]
            })
        }

    }

    return result;
}

exports.add_to_cart = (req, res) => {
    const title = req.query.title
    const price = req.query.price
    const foodId = req.body.foodId
    const toppings = req.body.toppings ? req.body.toppings : []

    let order_session_id = `${foodId}`
    for (let i = 0; i < toppings.length; i++) {
        order_session_id += "_" + toppings[i].topping_id.substring(0, 3)
    }


    console.debug(`foodId ${foodId}, title ${title}, price ${price}`)

    // adding id to session
    if (req.session.cart) {

        if (req.session.cart[order_session_id]) {
            req.session.cart[order_session_id].count += 1
        } else {
            req.session.cart[order_session_id] = {
                orderId: order_session_id,
                foodId: foodId,
                count: 1,
                note: "",
                name: title,
                price: parseInt(price),
                toppings: toppings
            }
        }
        req.session.cart_count += 1
    } else {
        req.session.cart = {}
        req.session.cart[order_session_id] = {
            orderId: order_session_id,
            count: 1,
            foodId: foodId,
            note: "",
            name: title,
            price: parseInt(price),
            toppings: toppings,
        }
        req.session.cart_count = 1
    }
    // next()
    console.debug(`Session cart_count ${req.session.cart_count}`)
    res.send({cart_count: req.session.cart_count})
}


exports.set_quantity = (req, res) => {
    let cart = req.session.cart
    const orderId = req.body.orderId
    const foodId = req.body.foodId
    const count = req.body.count

    req.session.cart[orderId].count = parseInt(count)
    let cart_count = 0
    let total_order_bill = 0
    let order_bill = 0
    cart = req.session.cart

    //loop through order in cart to calculate total bill
    for (const property in cart) {
        if (cart.hasOwnProperty(property)) {

            if (property == orderId) {
                //calculate bill for this order
                order_bill += cart[property].count * cart[property].price
            }
            cart_count += cart[property].count
            total_order_bill += cart[property].count * cart[property].price
            //calculate topping bill
            for (let i = 0; i < cart[property].toppings.length; i++) {
                total_order_bill += cart[property].toppings[i].topping_price * cart[property].count
                if (property == orderId) {
                    //calculate topping bill for this order
                    order_bill += cart[property].toppings[i].topping_price * cart[property].count
                }
            }
        }

    }
    req.session.cart_count = cart_count

    return res.send({
        order_bill: order_bill,
        count: count,
        price: cart[orderId].price,
        cart_count: cart_count,
        total_order_bill: total_order_bill
    })
}

exports.remove_an_order = (req, res) => {
    const id = req.body.orderId
    if (req.session.cart.hasOwnProperty(id)) {
        delete req.session.cart[id]
    }
    let cart_count = 0
    for (const property in req.session.cart) {
        if (req.session.cart.hasOwnProperty(property)) {
            cart_count += req.session.cart[property].count
        }
    }
    req.session.cart_count = cart_count

    res.status(200).send({
        message: "OK",
        cart_count: cart_count
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
                    time_created: new Date(),
                    status: "WAITING"
                }
            )


            // for (const property in session_order_items) {
            //     console.log(`${property}: ${session_order_items[property]}`);
            // }
            const items = Object.keys(session_order_items).map((key) => {
                return {
                    food_id: key,
                    food_price: session_order_items[key].price,
                    food_name: session_order_items[key].name,
                    count: session_order_items[key].count,
                    note: session_order_items[key].note,
                    toppings: session_order_items[key].toppings,
                }
            })

            // ref.collection("food")

            console.log(items)
            const batch = db.batch()
            items.forEach((item) => {
                const docRef = db.collection("order")
                    .doc(ref.id).collection('food')
                    .doc(item.food_id)

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

exports.set_note = (req, res) => {
    let cart = req.session.cart
    const note = req.body.note
    const orderId = req.body.orderId
    const isExist = cart.hasOwnProperty(orderId)
    if (isExist) {
        cart[orderId].note = note
        res.send(
            {
            message: "OK",
            note:note
        })
    } else {
        res.status(400).send({
            message: "error"
        })
    }
}


exports.menu_item_topping = (req, res) => {
    const name = req.params.name
    const id = req.params.id
    const food_price = parseInt(req.params.food_price)
    const db = admin.firestore();
    (async () => {
        const ref = await db.collection("topping").get()
        const toppings = ref.docs.map(e => {
            return {
                id: e.id,
                name: e.data().name,
                price: e.data().price,
                description: e.data().description,
            }
        })
        res.render("order/topping", {
            name: name,
            food_id: id,
            toppings: toppings,
            food_price: food_price
        })

    })()

}

//cart in session
function countItemsInCart(cart){

}
/// for admin ///


/// Admin order list ///
exports.order_list = function (req, res, next) {
    const db = admin.firestore();
    (async () => {
        const value = await db.collection('order').get();
        const items = value.docs.map((doc) => {

            let order = new Order()
            order.email = doc.data().email
            order.full_name = doc.data().full_name
            order.phone = doc.data().phone
            order.status = doc.data().status
            order.address = doc.data().address
            order.id = doc.id
            return order
        });
        let orders = []
        await async.map(items, async (order, callback) => {
            try {
                // const response = await db.collection('order').doc(order.id).collection('food').get()
                // const foods = response.docs.map(doc => {
                //     return {
                //         food_id: doc.data().food_id,
                //         count: doc.data().count,
                //         note: doc.data().note,
                //         toppings: doc.data().toppings
                //     }
                // })
                // order.count = foods.size
                //  order.foods = foods
                return order
            } catch (err) {
                callback(err)
            }
        }, (err, results) => {
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log(err)
                console.log('A item failed to process');
                next(err)
            } else {
                console.log('All item have been processed successfully');
                orders = results
                console.log(results)
                res.render('admin/order_list', {
                    orders: results,
                    error: null, title: "Danh sách đơn hàng"
                })
            }
        })


    })()

}
// Display detail page for a specific order.
exports.order_detail = function (req, res) {
    const id = req.params.id
    const db = admin.firestore();
    (async () => {
        const value = await db.collection('order').doc(id).get();
        let order = new Order()
        order.full_name = value.data().full_name
        order.email = value.data().email
        order.phone = value.data().phone
        order.address = value.data().address
        order.time_created = value.data().time_created
        order.status = value.data().status
        order.id = id
        const docs = (await db.collection('order').doc(id).collection('food').get()).docs
        order.foods = docs.map(e => e.data())
        const totalBill = order.billCount()
        res.render("admin/order_detail", {
            order: order,
            title: "Đơn hàng",
            total_bill: totalBill
        })
    })()
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

