const Food = require("../model/food")
const admin = require('firebase-admin')
const async = require('async');
const {body, validationResult} = require("express-validator");


exports.menu = function (req, res) {
    const db = admin.firestore();
    db.collection('food').get().then((value) => {
        const foods = value.docs.map((doc) => {
            let food = new Food()
            food.id = doc.id
            food.title = doc.data().title
            food.price = doc.data().price
            food.description = doc.data().description
            return food
        })
        res.render('menu', {title: 'Thực đơn', foods: foods});
    })
}

exports.menu_item = (req, res) => {
    res.render('menu_item', {title: 'Menu Item'});
}

exports.add_to_cart = (req, res) => {
    const foodId = req.query.id
    const title = req.query.title
    console.log(`foodId ${foodId}, title ${title}`)

    // adding id to session
    if (req.session.cart) {
        req.session.cart_count +=1
        req.session.cart[foodId] += 1
    } else {
        req.session.cart = {}
        req.session.cart[foodId] = 1
        req.session.cart_count = 1
    }
    // next()
    console.log(`Session cart_count ${req.session.cart_count}`)
    res.send({
        cart_count: req.session.cart_count
    })
}


/// Admin food list ///
exports.food_list = function (req, res) {

    // res.send('NOT IMPLEMENTED: Food list');

    const db = admin.firestore();
    db.collection('food').get().then((value) => {
        const foods = value.docs.map(doc => doc.data());
        res.render('admin/food_list', {foods: foods, error: null, title: "Danh sách sản phẩm"})
        // res.send(result);
    }).catch((error) => {
        console.log(error);
        res.render('admin/food_list;', {foods: [], error: error, title: "Danh sách sản phẩm"})
    });
}
// Display detail page for a specific food.
exports.food_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display Food create form on GET.
exports.food_create_get = function (req, res) {
    res.render('admin/food_create', {title: "Tạo sản phẩm mới"})
};



// Handle Food create on POST.
exports.food_create_post = [
    // Validate and santise the name field.
    body('title', 'Phải có tiêu đề').trim().isLength({min: 1}).escape(),
    body('price', 'Phải có giá sản phẩm').isNumeric().escape(),
    body('description', 'Phải có nội dung').trim().isLength({min: 1}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);


        console.log('Upload Image');


        //TODO upload image from image field

        // let file = req.file;
        // if (file) {
        //     uploadImageToStorage(file).then((success) => {
        //         res.status(200).send({
        //             status: 'success'
        //         });
        //     }).catch((error) => {
        //         console.error(error);
        //     });
        // }

        const image_url = req.body.image

        // Create a genre object with escaped and trimmed data.
        let food = new Food(
            req.body.title,
            req.body.price,
            req.body.description,
        )

        food.image_url = image_url

        //CHecking if title or content is empty
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('admin/food_create', {
                title: 'Tạo blog',
                food: food,
                errors: errors.array()
            });
            return;
        }


        //insert to firestore
        const db = admin.firestore();

        async.waterfall([
            async (callback) => {
                await db.collection('food').doc(food.id).set(
                    {
                        title: food.title,
                        price: food.price,
                        description: food.description,
                        image_url: food.image_url
                    }, {
                        merge: true
                    }
                )
                return "Done"
            }
        ], (err, result) => {
            if (err) {
                return next(err);
            }
            if (result !== "Done") { // No results.
                const err = new Error('Không tìm thấy người dùng');
                err.status = 404;
                return next(err);
            }
            res.redirect("/admin/food")
        })

    }];

// Display Author delete form on GET.
exports.food_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.food_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.food_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.food_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};



