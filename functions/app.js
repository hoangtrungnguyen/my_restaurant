const functions = require("firebase-functions");

const admin = require('firebase-admin')

const express = require('express');

const app = express();

//  admin.initializeApp({
//     databaseURL: 'https://restaurant-56248-default-rtdb.firebaseio.com/',
//     credential: admin.credential.cert('restaurant-56248.json')
// });

admin.initializeApp()

const usersRouter = require('./routes/user');
app.use("/api/users",usersRouter)



async function grantModeratorRole(email) {
    const user = await admin.auth().getUserByEmail(email)
    if (user.customClaims && user.customClaims.moderator === true) {
        return
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        moderator: true
    })
}

const addModerator = functions.https.onCall(((data, context) => {
    if (context.auth.token.moderator !== true) {
        return {
            error: "Request not authorized. User must be admin."
        }
    }

    const email = data.email
    return grantModeratorRole(email).then(() => {
        return {
            message: `Granted!! ${email} is now a moderator.`
        }
    })
}))

// app.get('/addModerator',addModerator)





/** set role **/

//email nguyencua1810@gmail.com
admin.auth().setCustomUserClaims("JWF4U3H6BwfQQ4qLseWDMxlyito1", {
    admin: true,
    moderator: true
}).then(() => {

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});









