const admin = require('firebase-admin')
exports.register = function (req, res) {
    res.render('account/register')
}

exports.log_in_get = function (req, res) {
    res.render('account/log_in')
}

exports.log_in_post = function (req, res) {

}

exports.forgot_pw = function (req, res) {
    res.render('account/forgot_pw')
}

exports.log_out = async (req,res) => {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    res.clearCookie('uid')

    admin
        .auth()
        .verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
            return admin.auth().revokeRefreshTokens(decodedClaims.sub);
        })
        .then(() => {
            req.session.isAuthenticated = false
            res.redirect('/log-in');
        })
        .catch((error) => {
            req.session.isAuthenticated = false
            res.redirect('/log-in');
        }).finally(()=>{
    });
}

//verify ID token after user successful log in
exports.verify_id_token = async (req, res, next) => {
    // idToken comes from the client app
    const idToken = req.body.idToken
    const uid = req.body.uid

    // Verify the ID token while checking if the token is revoked by passing
    // checkRevoked true.
    let checkRevoked = true;
    try {
        const decodedToken = await admin
            .auth()
            .verifyIdToken(idToken, checkRevoked)
        const uid = decodedToken.uid;
        // res.send({
        //     message:"OK"
        // })

    } catch (error) {
        if (error.code == 'auth/id-token-revoked') {
            //TODO Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            res.status(403).send({
                message: "re-authenticate"
            })
        } else {
            // Token is invalid.
            res.status(403).send({
                message: "ERROR"
            })
        }
        return
    }
    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const options = {maxAge: expiresIn, httpOnly: true};
        let sessionCookie = await admin
            .auth()
            .createSessionCookie(idToken, {expiresIn})
        res.cookie("session", sessionCookie, options);
        res.cookie('uid',uid)
        req.session.isAuthenticated = true
        res.status(200).end(JSON.stringify({message: "success"}));
    } catch (e) {
        res.status(401).send({
            message:"UNAUTHORIZED REQUEST!"
        });
    }

}
