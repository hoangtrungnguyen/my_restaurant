const express = require('express');
const router = express.Router();
const authenticate = require('../controller/authenticateController');

router.post('/verify_id_token',authenticate.verify_id_token)

router.get('/register', authenticate.register)
router.get('/log-in', authenticate.log_in_get)
router.post('/log-in', authenticate.log_in_post)

router.get('/log-out', authenticate.log_out)


router.get('/forgot_pw', authenticate.forgot_pw)




module.exports = router;