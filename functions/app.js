//set up package
const functions = require("firebase-functions");

const admin = require('firebase-admin')
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

const express = require("express"),
    flash = require('connect-flash'),
    session = require('express-session'),
    toastr = require('express-toastr');

const bodyParser = require('body-parser');
const engines = require("consolidate")
const path = require('path')
const logger = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true});
const FirebaseStore = require('connect-session-firebase')(session);
const pug = require('pug')

const serviceAccount = require('./restaurant-56248.json');
//
const ref = admin.initializeApp({
    databaseURL: 'https://restaurant-56248-default-rtdb.firebaseio.com/',
    credential: admin.credential.cert('./restaurant-56248.json')
});


//router
const indexRouter = require('./routes');
// const blogRouter = require('./routes/blog');
const adminRouter = require('./routes/admin');
const foodRouter = require('./routes/order');
const testRouter = require('./routes/upload');


//set up using for index
// admin.initializeApp()
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let isMultipart = /^multipart\//i;
let urlencodedMiddleware = bodyParser.urlencoded({extended: true});
app.use(function (req, res, next) {
    let type = req.get('Content-Type');
    if (isMultipart.test(type)) return next();
    return urlencodedMiddleware(req, res, next);
});

app.use(session({
    store: new FirebaseStore({
        database: ref.database()
    }),
    name: '__session',
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000,
        secure: false,
        httpOnly: false
    }
}));
// app.use(validateFirebaseIdToken);
app.use(cors);

app.use(flash());

// Load express-toastr
// You can pass an object of default options to toastr(), see example/index.coffee
app.use(toastr());

//static file
app.use(express.static(path.join(__dirname, 'public')));

//session access
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

/* using router */
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

exports.app = functions.https.onRequest(app);


//comment before deploy
// module.exports = app



