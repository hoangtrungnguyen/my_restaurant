const express = require('express');
const router = express.Router();

// Require our controllers.
const user_controller = require('../controller/userController');
const food_controller = require('../controller/foodController');
const blog_controller = require('../controller/blogController');
const order_controller = require('../controller/orderController');


function publicCache(req, res, next) {
    res.set('Cache-Control', 'public, max-age=3000, s-maxage=6000')
    next()
}

/* GET home page. */
router.get('',publicCache, user_controller.index);

router.get('/menu', publicCache,food_controller.menu);
//no refresh page
router.post("/menu/add-to-cart", order_controller.add_to_cart)
router.get("/menu/topping/:id/:name/:food_price", order_controller.menu_item_topping)

router.get("/cart/submitted", order_controller.submitted)
router.get("/cart", order_controller.cart)
router.post("/cart/set-note", order_controller.set_note)
router.post("/cart/submit", order_controller.submit_order)
router.post("/cart/set-quantity", order_controller.set_quantity)
router.post("/cart/remove-an-order", order_controller.remove_an_order)


router.get('/blog',publicCache, blog_controller.blog);
router.get('/blog/:id',publicCache, blog_controller.post);

router.get('/contact',publicCache,(req,res)=>{
    res.render('contact',{
        title:"Liên hệ"
    })
})

router.post("/send-feed-back",user_controller.feed_back_post)

router.get("/timestamp", (req, res) => {
    res.send(`${Date.now()}`);
});

module.exports = router;