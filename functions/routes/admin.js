const express = require('express');
const multer = require('multer')
const router = express.Router();
// Require our controllers.
const food_controller = require('../controller/foodController');
const blog_controller = require('../controller/blogController');
const user_controller = require('../controller/userController');
const order_controller = require('../controller/orderController');


router.get('/', ((req, res) => {
    res.render("admin/overview")
}))


// users Routes ///
router.get('/user',user_controller.user_list)
router.get('/user/:id',user_controller.user_detail)
router.post('/user/:id/update',user_controller.user_update_post)
router.get('/user/:id/delete',user_controller.user_delete_get)
router.post('/user/:id/delete',user_controller.user_delete_post)


/// food ROUTES ///



// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/food/create', food_controller.food_create_get);


// SET STORAGE
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        cb(null, 'uploads')
        // await
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({dest: "uploads", storage: storage})

//TODO thêm chức năng đẩy lên firestore

// POST request for creating Book.
router.post('/food/create', food_controller.food_create_post);

// GET request to delete Book.
router.get('/food/:id/delete', food_controller.food_delete_get);

// POST request to delete Book.
router.post('/food/:id/delete', food_controller.food_delete_post);

// GET request to update Book.
router.get('/food/:id/update', food_controller.food_update_get);

// POST request to update Book.
router.post('/food/:id/update', food_controller.food_update_post);

// GET request for one Book.
router.get('/food/:id', food_controller.food_detail);

// GET request for list of all Book items.
router.get('/food', food_controller.food_list);


/// blog Routes ///

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/blog/create', blog_controller.blog_create_get);

// POST request for creating Book.
router.post('/blog/create', blog_controller.blog_create_post);

// GET request to delete Book.
router.get('/blog/:id/delete', blog_controller.blog_delete_get);

// POST request to delete Book.
router.post('/blog/:id/delete', blog_controller.blog_delete_post);

// GET request to update Book.
router.get('/blog/:id/update', blog_controller.blog_update_get);

// POST request to update Book.
router.post('/blog/:id/update', blog_controller.blog_update_post);

// GET request for one Book.
router.get('/blog/:id', blog_controller.blog_detail);

// GET request for list of all Book items.
router.get('/blog', blog_controller.blog_list);



/// orders Routes ///
// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/order/create', order_controller.order_create_get);

// POST request for creating Book.
router.post('/order/create', order_controller.order_create_post);

// GET request to delete Book.
router.get('/order/:id/delete', order_controller.order_delete_get);

// POST request to delete Book.
router.post('/order/:id/delete', order_controller.order_delete_post);

// GET request to update Book.
router.get('/order/:id/update', order_controller.order_update_get);

// POST request to update Book.
router.post('/order/:id/update', order_controller.order_update_post);

// GET request for one Book.
router.get('/order/:id', order_controller.order_detail);

// GET request for list of all Book items.
router.get('/order', order_controller.order_list);


module.exports = router;