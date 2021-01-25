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
router.post("/menu/add-to-cart",food_controller.add_to_cart)

router.get("/cart",order_controller.cart)



router.get('/blog',blog_controller.blog );
router.get('/blog/:id',blog_controller.post );






router.get("/timestamp", (req, res) => {
    res.send(`${Date.now()}`);
});

module.exports = router;