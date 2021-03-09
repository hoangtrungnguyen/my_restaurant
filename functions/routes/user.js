let express = require('express');
let router = express.Router();

const admin = require('firebase-admin')
const functions = require("firebase-functions");

let user_controller = require('../controller/userController.js')


router.post('/',user_controller.user_list)
router.get('/',(req,res)=>{
    res.send("GET users API not yet implement")
})



exports.addModerator = functions.https.onCall(((data, context) => {
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

async function grantModeratorRole(email) {
    const user = await admin.auth().getUserByEmail(email)
    if (user.customClaims && user.customClaims.moderator === true) {
        return
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        moderator: true
    })
}



module.exports = router