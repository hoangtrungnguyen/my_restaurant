const admin = require('firebase-admin')
const async = require('async');
const Blog = require("../model/blog");
const {body, validationResult} = require("express-validator");

/// For user site ///
exports.blog = function (req, res) {
    const db = admin.firestore();
    db.collection('blog').get().then((value) => {
        const blogs = value.docs.map(function (doc) {
            return {
                id: doc.id,
                title: doc.data().title,
                summary: doc.data().summary,
                content: doc.data().content
            }

        });
        res.render('blog/blog', {title: "Blog", blogs: blogs, error: null})
        // res.send(result);
    })
}


// what user see on their browser
exports.post = function (req, res) {
    const blog = {}

    res.render('blog/post', {title: "Blog" , blog: blog, error: null})
}


/// For admin ///

//List all blog
exports.blog_list = function (req, res) {
    const db = admin.firestore();
    db.collection('blog').get().then((value) => {
        const blogs = value.docs.map(function (doc) {
            return {
                id: doc.id,
                title: doc.data().title,
                summary: doc.data().summary,
                content: doc.data().content
            }

        });
        res.render('admin/blog_list', {blogs: blogs, error: null})
        // res.send(result);
    }).catch((error) => {
        console.log(error);
        res.render('admin/blog_list;', {blogs: [], error: error})
    });
}

// Display detail page for a specific book.
exports.blog_detail = function (req, res, next) {
    const id = req.params.id
    const db = admin.firestore();
    db.collection('blog').doc(id).get().then((value) => {
        // Create a genre object with escaped and trimmed data.
        let blog = new Blog(
            value.data().title,
            value.data().summary,
            value.data().content,
        )
        blog.id = id;
        res.render('admin/blog_detail', {blog: blog, error: null})
        // res.send(result);
    }).catch((error) => {
        console.log(error);
        res.render('admin/blog_detail;', {blogs: null, error: error})
    });
};

// Display Food create form on GET.
exports.blog_create_get =
    (req, res, next) => {
        res.render('admin/blog_create', {title: "Tạo blog mới"})
    };

// Handle Blog create on POST.
exports.blog_create_post = [
    // Validate and santise the name field.
    body('title', 'Phải có tiêu đề').trim().isLength({min: 1}).escape(),
    body('summary', 'Phải có tóm tắt').trim().isLength({min: 1}).escape(),
    body('content', 'Phải có nội dung').trim().isLength({min: 1}).escape(),

    // Process request after validation and sanitization.
    (req, res) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        let blog = new Blog(
            req.body.title,
            req.body.summary,
            req.body.content,
        )

        //CHecking if title or content is empty
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('admin/blog_create', {
                title: 'Tạo blog',
                blog: blog,
                errors: errors.array()
            });
            return;
        }


        //insert to firestore
        const db = admin.firestore();

        db.collection('blog').doc(blog.id).set(
            {
                title: blog.title,
                summary: blog.summary,
                content: blog.content,

            }, {
                merge: true
            }
        ).then(value => {
            console.log(value.toString())
            res.redirect('/admin/blog/')

        })
        // res.send('NOT IMPLEMENTED: Blog create POST');
    }];

// Display Blog delete form on GET.
exports.blog_delete_get = function (req, res) {
    const db = admin.firestore();
    const id = req.params.id
    db.collection('blog').doc(id.toString()).get().then((value) => {
        res.render('admin/blog_delete', {
            blog: {
                title: value.data().title
            }
        })
    })
};

// Handle Blog delete on POST.
exports.blog_delete_post = function (req, res) {
    const db = admin.firestore();
    const id = req.params.id
    db.collection('blog').doc(id).delete().then((value) => {
        res.redirect('/admin/blog/')
    })
};

// Display Author update form on GET.
exports.blog_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.blog_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};



