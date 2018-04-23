var express = require('express');
var router = express.Router();
var User = require('../../src/models/user');
var userHandlers = require('../../src/controllers/UserController.js');


router.route('/login')
    		.post(userHandlers.sign_in);

router.route('/user')
		.post( userHandlers.register);

router.route('/user/:userId')
    		.put( userHandlers.updateUser);


module.exports = router;
