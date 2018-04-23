//var mongoose = require('mongoose'),
var jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');
var User = require('../../src/models/user');
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
var playerHandler = require('../../src/controllers/PlayerController.js');
var fs = require('fs');
var path = require('path');

const secret = "mysecretkey";
function createToken(user) {
  let { id, first_name, last_name, email } = user;
  let token = jwt.sign({ id, first_name, last_name, email }, secret);
  return token;
}

exports.register = function (req, res) {

  req.check('first_name', 'first name is required').notEmpty();
  req.check('last_name', 'last name is required').notEmpty();
  req.check('email', 'Invalid Email').isEmail();
  req.check('password', 'password is required').notEmpty();
  req.check('confirm_password', 'confirm password is required').notEmpty();
  var errors = req.validationErrors();
  if (!isEmpty(req.body.password) && !isEmpty(req.body.confirm_password) && req.body.password !== req.body.confirm_password) {

    if (!errors) {
      errors = [];
    }
    var msg = {
      location: 'password , confirmpassword',
      msg: "password doesn't match"
    }
    errors.push(msg);
  }


  if (errors) {
    res.status(409).json({ success: false, message: errors });
  } else {
    var newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10, function (err, res) {
      if (err)
        res.status(409).json({ success: false, message: "Error occurred while creating user" });
    });

    User.findOne({
      email: req.body.email
    }, async function (err, user) {
      if (err) {
        return res.status(409).json({ message: 'Unknown error occurred' });
      }
      if (user) {
        return res.status(409).json({ message: 'User Already exists' });
      } else {
        newUser.save(function (err, user) {
          if (err) {
            return res.status(409).send({
              errors: err,
              success: false

            });
          } else {
            user.password = undefined;
            var authToken = createToken(user);
            res.status(201).json({ success: true, user, token: authToken });
          }
        });

      }
    });


  }
};



exports.sign_in = async function (req, res, next) {
  User.findOne({
    email: req.body.email
  }, async function (err, user) {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }

    var authToken = createToken(user);
    var players = await playerHandler.getAllPlayers(req, res);
    res.status(200).json({ success: true, user: user, token: authToken });
  });
};

exports.updateUser = async function (req, res, next) {
  var query = { _id: req.params.userId };
  var update = req.body;
  update.id = req.params.userId;
  var options = { new: true, upsert: true };
  var user = User.findOneAndUpdate(query, update, options);

  if (!user) {
    res.status(500).send('fail');
  } else {
    res.status(200).send({ 'success': true, 'user': user._update });
  }

};



function isEmpty(str) {
  return (!str || 0 === str.length);
}


