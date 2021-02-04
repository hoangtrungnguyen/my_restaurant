const admin = require('firebase-admin')
const async = require('async');
const {body, validationResult} = require("express-validator");


exports.register = function (req, res) {
    res.render('account/register')
}