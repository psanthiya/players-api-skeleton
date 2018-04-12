var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../../src/models/user');
var userHandlers = require('../../src/controllers/UserController.js');

router.get('/login', function (req, res) {
    res.render("login");
});

router.route('/login')
    		.post(userHandlers.sign_in);

router.get('/user', function (req, res) {
    res.render("register");
});

router.route('/user')
		.post( userHandlers.register);

router.route('/user/:userId')
    		.put( userHandlers.updateUser);


module.exports = router;
