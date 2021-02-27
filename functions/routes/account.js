const express = require('express');
const router = express.Router();
const account_controller = require("../controller/accountController.js")

//TODO lịch sử, đơn hiện tại, profile
router.get("/profile", account_controller.profile)


module.exports = router;