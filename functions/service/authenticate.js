const admin = require('firebase-admin');
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.

const validateFirebaseIdToken = async (req, res, next) => {
    const sessionCookie = req.cookies.session || "";
    try {
        const decodedClaim = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
        req.session.isAuthenticated = true
        next()
    } catch (error) {
        // error.status = 401
        // error.message = "Bạn không có quyền vào trang này"
        // next(error)
        console.debug(error)
        req.session.isAuthenticated = false
        res.redirect('/log-in')
    }


    // console.log('Check if request is authorized with Firebase ID token');

    // if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    //     !(req.cookies && req.cookies.__session)) {
    //     console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
    //         'Make sure you authorize your request by providing the following HTTP header:',
    //         'Authorization: Bearer <Firebase ID Token>',
    //         'or by passing a "__session" cookie.');
    //
    //     const err = new Error('Bạn không có quyền truy cập');
    //     err.status = 403;
    //     return next(err);
    // }
    //
    // let idToken;
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    //     console.log('Found "Authorization" header');
    //     // Read the ID Token from the Authorization header.
    //     idToken = req.headers.authorization.split('Bearer ')[1];
    // } else if (req.cookies) {
    //     console.log('Found "__session" cookie');
    //     // Read the ID Token from cookie.
    //     idToken = req.cookies.__session;
    // } else {
    //     // No cookie
    //     const err = new Error('Bạn không có quyền truy cập');
    //     err.status = 403;
    //     return next(err);
    // }
    //
    // try {
    //     const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    //     console.log('ID Token correctly decoded', decodedIdToken);
    //     req.user = decodedIdToken;
    //     next();
    // } catch (error) {
    //     console.error('Error while verifying Firebase ID token:', error);
    //     const err = new Error('Bạn không có quyền truy cập');
    //     err.status = 403;
    //     return next(err);
    // }
};


const validateIsAdmin = async (req, res, next) => {
    const sessionCookie = req.cookies.session || "";
    try {
        const decodedClaim = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
        if (decodedClaim.admin === true) {
            // return serveContentForAdmin('/admin', req, res, decodedClaims);
            next()
        } else {
            let error = new Error()
            error.status = 403
            error.message = "Bạn không có quyền vào trang này"
            next(error)
        }
    } catch (error) {
        error.status = 403
        error.message = "Bạn không có quyền vào trang này"
        next(error)
    }
}


const isAuthenticated = async (req, res, next) => {
    //TODO checking if isAuthenticated

    next()
}
module.exports = {
    validateFirebaseIdToken: validateFirebaseIdToken,
    validateIsAdmin: validateIsAdmin,
    isAuthenticated: isAuthenticated
}