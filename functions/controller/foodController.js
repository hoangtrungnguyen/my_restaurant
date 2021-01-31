const Food = require("../model/food")
const admin = require('firebase-admin')
const async = require('async');
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();

// Creates a client
const storage = new Storage();

const bucket = storage.bucket("restaurant-56248.appspot.com");


exports.menu = function (req, res) {
    const db = admin.firestore();
    db.collection('food').get().then((value) => {
        const foods = value.docs.map((doc) => {
            let food = new Food()
            food.id = doc.id
            food.image_url = doc.data().image_url
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


/// Admin food list ///
exports.food_list = function (req, res) {

    // res.send('NOT IMPLEMENTED: Food list');
    (async () => {
        try {
            const db = admin.firestore();
            const value = await db.collection('food').get()
            const foods = value.docs.map((doc) => {
                let food = new Food(
                    doc.data().title,
                    doc.data().price,
                    doc.data().description
                )

                food.image_url = doc.data().image_url
                food.id = doc.id
                return food
            });


            const data = await db.collection('topping').get()
            const toppings = data.docs.map((doc) => {
                return {
                    name: doc.data().name,
                    price: doc.data().price,
                    description: doc.data().description,
                }
            });

            res.render('admin/food_list', {foods: foods,toppings:toppings, error: null, title: "Danh sách sản phẩm"})
        } catch (error) {
            res.status(404).send("error")
        }
    })()
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

// const multer = Multer({
//     // dest:"../uploads",
//     storage: Multer.memoryStorage(),
//     limits: {
//         fileSize: 1024 * 1024 // no larger than 1mb, you can change as needed.
//     }
// });


exports.food_create_post = [
    // Validate and santise the name field.
    // multer.single('image'),
    // Process request after validation and sanitization.
    (req, res, next) => {

        console.debug("Validate input")
        // const errors = validationResult(req);
        let errors = []
        if (req.body.title.trim().length < 1) {
            errors.push(Error("Tiêu đề không được để trống"))
        }


        // Create a genre object with escaped and trimmed data.
        let food = new Food(
            req.body.title,
            req.body.price,
            req.body.description,
        )

        //CHecking if title or content is empty
        if (errors.length > 0) {
            console.debug('Redirect if errors occurs');
            res.render('admin/food_create', {
                title: 'Tạo blog',
                food: food,
                errors: errors
            });
            return;
        }

        let image = req.file;
        const buffer = req.file.buffer

        const db = admin.firestore()
        async.waterfall([
            async () => {
                console.debug('Upload image')
                const image_url = await new Promise((resolve, reject) => {
                    let newFileName = image.originalname;

                    let fileUpload = bucket.file(newFileName);

                    fileUpload.save(buffer)

                    console.debug(`UUID ${uuid}`)
                    const blobStream = fileUpload.createWriteStream({
                        metadata: {
                            metadata: {
                                firebaseStorageDownloadTokens: uuid,
                            },
                            contentType: image.mimeType,
                            cacheControl: 'public, max-age=31536000',
                        }
                    });

                    blobStream.on('error', (error) => {
                        console.debug(error)
                        reject('Something is wrong! Unable to upload at the moment.');
                    });

                    blobStream.on('finish', () => {

                        // The public URL can be used to directly access the file via HTTP.
                        // const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
                        //return url in the future when finish
                        const url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + newFileName + "?alt=media&token=" + uuid

                        resolve(url);
                        // resolve(image_url);
                    });

                    blobStream.end(buffer);
                })
                console.debug("Uploaded image's url ", image_url)
                return image_url
            },
            async (image_url, callback) => {
                await db.collection('food').doc(food.id).set(
                    {
                        title: food.title,
                        price: food.price,
                        description: food.description,
                        image_url: image_url
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
    const food = {}
    res.render("admin/food_delete", {title: "Xóa sản phẩm", food: food})
};

// Handle Author delete on POST.
exports.food_delete_post = function (req, res) {
    const foodId = req.params.id

    const db = admin.firestore();
    db.collection('food').doc(foodId).delete().then((result) => {
        res.redirect("/admin/food")
    })

};

// Display Author update form on GET.
exports.food_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.food_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};


exports.topping_create_get = function (req, res) {
    res.render('admin/topping_create')
}

exports.topping_create_post = (req, res) => {
    (async function () {
        const db = admin.firestore()
        const name = req.body.name
        const price = req.body.price
        const description = req.body.description

        const ref = db.collection('topping').doc()
        const id = ref.id

        await ref.set({
            name: name,
            price: price,
            description: description
        })

        res.redirect('/admin/food')

    })()
}