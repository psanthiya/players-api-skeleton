// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/login', function (req, res) {
    res.render("login");
});
module.exports = router;
