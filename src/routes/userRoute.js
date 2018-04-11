// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var User = require('../../src/models/user');
var userHandlers = require('../../src/controllers/userController.js');


/*
router.get('/', function (req, res) {
     User.remove({}, function(err) {
        console.log('collection removed')
     });
         res.redirect("/api/players/pingpong");
     });
*/


router.get('/', function (req, res) {
  console.log("coming here");
    res.render("login");
});

router.get('/register', function (req, res) {
    res.render("register");
});

router.post('/user',  function (req, res) {
    //res.render("user");
    console.log(req.body.first_name);
    User.create({
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                email: req.body.email,
                password : req.body.password,
                confirm_password : req.body.confirm_password
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(user);
            });
});

router.route('/register')
		.post( userHandlers.register);

router.route('/signin')
    		.post(userHandlers.sign_in);

/*
function validatePhoto(req, res, next) {
console.log(req);
  req.checkBody('first_name', 'Invalid description').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push(err.msg);
    });
    res.statusCode = 400;
    return res.json(response);
  }
  return next();
 }
*/

module.exports = router;

/*module.exports  = function(router) {
	var userHandlers = require('../../src/controllers/userController.js');


	router.route('/register')
		.post(userHandlers.register);

*//*	app.route('/auth/sign_in')
		.post(userHandlers.sign_in);*//*

};*/
