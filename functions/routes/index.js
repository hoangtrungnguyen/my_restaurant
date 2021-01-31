const express = require('express');
const router = express.Router();

// Require our controllers.
const user_controller = require('../controller/userController');
const food_controller = require('../controller/foodController');
const blog_controller = require('../controller/blogController');
const order_controller = require('../controller/orderController');

/* GET home page. */
router.get('', user_controller.index);

router.get('/menu', food_controller.menu);
router.get('/menu/:id', food_controller.menu_item);
//no refresh page
router.post("/menu/add-to-cart",order_controller.add_to_cart)
router.get("/menu/topping/:id/:name/:food_price",order_controller.menu_item_topping)

router.get("/cart",order_controller.cart)
router.post("/cart/set-note",order_controller.set_note)
router.post("/cart/submit",order_controller.submit_order)
router.post("/cart/set-quantity",order_controller.set_quantity)
router.post("/cart/remove-an-order",order_controller.remove_an_order)
router.post("/cart/remove-an-order",order_controller.remove_an_order)



router.get('/blog',blog_controller.blog );
router.get('/blog/:id',blog_controller.post );







router.get("/timestamp", (req, res) => {
    res.send(`${Date.now()}`);
});

module.exports = router;