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
            food.ref = doc.ref
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

            res.render('admin/food_list', {
                foods: foods,
                toppings: toppings,
                error: null,
                title: "Danh sách sản phẩm"
            })
        } catch (error) {
            res.status(404).send("error")
        }
    })()
}
// Display detail page for a specific food.
exports.food_detail = function (req, res) {

    (async () => {
        const foodId = req.params.id
        const food = await  getFood(foodId)
        res.render('admin/food_detail', {food: food})
    })()
};

// Display Food create form on GET.
exports.food_create_get = function (req, res) {
    res.render('admin/food_create', {title: "Tạo sản phẩm mới"})
};

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
                    let image_name = image.originalname;

                    let fileUpload = bucket.file(image_name);

                    fileUpload.save(buffer)

                    console.debug(`UUID ${uuid}`)
                    const blobStream = fileUpload.createWriteStream({
                        metadata: {
                            metadata: {
                                firebaseStorageDownloadTokens: uuid,
                            },
                            firebaseStorageDownloadTokens: uuid,
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
                        const url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + image_name + "?alt=media&token=" + uuid
                        food.image_name = image_name
                        resolve(url);
                        // resolve(image_url);
                    });

                    blobStream.end(buffer);
                })
                console.debug("Uploaded image's url ", image_url)
                return image_url
            },
            async (image_url, callback) => {
                food.image_url = image_url

                await db.collection('food').doc(food.id).set(
                    JSON.parse(JSON.stringify(food)), {
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

async function getFood(foodId) {
    const db = admin.firestore();
    const ref = await db.collection('food').doc(foodId)
    let food = new Food()
    food.ref = ref.path
    const doc = await ref.get()
    food.id = doc.id
    food.description = doc.data().description
    food.price = doc.data().price
    food.title = doc.data().title
    food.image_url = doc.data().image_url
    food.image_name = doc.data().image_name
    food.is_remaining = doc.data().is_remaining
    food.ref = doc.ref
    return food
}

// Display Author delete form on GET.
exports.food_delete_get = function (req, res) {
    (async () => {
        const foodId = req.params.id
        const food = await getFood(foodId)

        res.render("admin/food_delete", {title: "Xóa sản phẩm", food: food})
    })()

};

// Handle Author delete on POST.

exports.food_delete_post = function (req, res, next) {
    const foodId = req.params.id
    if (!req.body.password || req.body.password !== '7432') {
        const err = new Error('Bạn không thể xóa');
        err.status = 403;
        return next(err);
    }

    const db = admin.firestore();
    db.collection('food').doc(foodId).delete().then((result) => {
        res.redirect("/admin/food")
    }).then(async (value) => {
        await deleteImage(req.body.image_name)
    }).catch(err =>{
        console.log(err)
    })

};

async function deleteImage(imageName) {
    const file = bucket.file(imageName)

    file.delete().then(() => {
        console.log(`Successfully deleted photo`)
    }).catch(err => {
        console.log(`Failed to remove photo, error: ${err}`)
    });
}

// Display Author update form on GET.
exports.food_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.food_update_post = (req, res, next) => {
    // Create a genre object with escaped and trimmed data.
    let food = new Food(
        req.body.title,
        req.body.price,
        req.body.description,
    )
    food.id = req.params.id

    food.is_remaining = req.body.is_remaining
    food.count = req.body.count

    let image = req.file;

    const db = admin.firestore()
    async.waterfall([
        async () => {
            if (!image) {
                food.image_name = req.body.image_name
                food.image_url = req.body.image_url
                return null
            }

            await deleteImage(req.body.image_name)

            const buffer = req.file.buffer
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
                        firebaseStorageDownloadTokens: uuid,
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
                    food.image_name = newFileName
                    resolve(url);
                    // resolve(image_url);
                });

                blobStream.end(buffer);
            })
            console.debug("Uploaded image's url ", image_url)
            return image_url
        },
        async (image_url, callback) => {
            if (image_url != null)
                food.image_url = image_url

            const doc = db.collection('food').doc(food.id)
            food.ref = doc.path
            await doc.update(
                JSON.parse(JSON.stringify(food)),
            )

            return "Done"
        }
    ], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result !== "Done") { // No results.
            const err = new Error('Lỗi xảy ra');
            err.status = 404;
            return next(err);
        }
        res.redirect("/admin/food")
    })
}


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