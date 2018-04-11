//var mongoose = require('mongoose'),
 var jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');
  var User = require('../../src/models/user');
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
var playerHandler = require('../../src/controllers/playerController.js');
var fs   = require('fs');
var path = require('path');

const secret = "mysecretkey";
function createToken(user) {
  let { id, first_name, last_name, email } = user;
  let token = jwt.sign({  email }, secret); // password is salted, so this is fine
  return token;
}

var isAuthorized = async function(req, res, next) {
console.log(req.headers.authorization);
  var authorization = await req.headers.authorization;
  if (authorization === null || authorization === undefined) {
    var err = new Error('Token is null');
    err.status = 403;
    return next(err);
  }

  var token = authorization.split('Bearer ')[1];
  console.log(token);
  var decoded = jwt.decode(authorization,
   secret);
console.log("**Decoded" + decoded);
if(decoded === null){
console.log("email null");
      var err = new Error('Not authorized');
      err.status = 403;
      return next(err);
} else{
User.findOne({"email": decoded.email}).exec(function(error, user) {
    if (error) {
    console.log("Error");
        var err = new Error('Error Occurred');
          err.status = 403;
          return next(err);
    }
    if (user === null) {
    console.log("user");
      var err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    console.log("**Here");
    return next(req);
  });
    return;
}



};

exports.register =  function(req, res) {


    req.check('first_name', 'first name is required').notEmpty();
    req.check('last_name', 'last name is required').notEmpty();
    req.check('email', 'Invalid Email').isEmail();
    req.check('password', 'password is required').notEmpty();
    req.check('confirm_password', 'confirm password is required').notEmpty();
    var errors = req.validationErrors();

    if (!isEmpty(req.body.password) && !isEmpty(req.body.confirm_password)  && req.body.password !== req.body.confirm_password) {
      if(!errors){
          errors = [];
        }
       var msg = {
             location: 'password , confirmpassword',
             msg: "password doesn't match"
                    }
        errors.push(msg);
      }


        if(errors){
          res.render('register', { errors: errors });
        } else {
          var newUser = new User(req.body);
          newUser.hash_password = bcrypt.hashSync(req.body.password, 10, function(err, res){
          if(err)
            console.log("Error occurred")
          });
          console.log("newUser.password "+ newUser.hash_password );
          newUser.save(function(err, user) {
            if (err) {
              return res.status(400).send({
                errors: err,
                success: false

              });
            } else {
              user.hash_password = undefined;
              let authToken = createToken(user);
              res.set({'authorization': authToken});
              return res.render('register', { success: true, user, token: authToken });
            }
          })
        }
 };


exports.sign_in = async function(req, res,next) {
  req.check('email', 'Email is required').notEmpty();
  req.check('password', 'Password is required').notEmpty();
  var errors = req.validationErrors();
//await isAuthorized(req, res, next);

  if(!errors){
    User.findOne({
        email: req.body.email
      }, async function(err, user) {
      console.log(user);
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
         // return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
         if(!errors){errors = [];}
         var msg = { msg: "Login failed. Invalid user or password"};
         errors.push(msg);
        }
        if(errors){
          res.render('login', { errors: errors });
        } else{
            //const authToken = jwt.sign({ first_name: user.first_name, last_name: user.last_name, _id: user._id }, 'RESTFULAPIs')
            let authToken = createToken(user);
            var players = await playerHandler.user1(req, res);
           /* res.writeHead(200, {
                'content-type': 'text/html',
                'authorization': authToken
              });*/
               // return res.end(loadView("board"));
            //res.redirect("/api/board.ejs");
            //res.set("authorization", authToken);
            //res.render("board", {success: true, user: user, token: authToken, players: players});
            res.writeHead(200, {
                'content-type': 'text/html',
                'authorization': authToken
              });
              return res.end(restricted);

        }
      });
  } else {
        res.render('login', { errors: errors });
  }

};

function isEmpty(str) {
    return (!str || 0 === str.length);
}


function loadView(view) {
  var filepath = path.resolve("./src/views/"+ view +".ejs");
  return fs.readFileSync(filepath).toString();
}

exports.isAuthorized = isAuthorized;
