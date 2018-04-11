//var mongoose = require('mongoose'),
var jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');
var Player = require('../../src/models/player');
var bodyParser = require('body-parser');
var path;
var userHandler = require('../../src/controllers/userController.js');
var utils = require('../../src/utils/Utils.js');
const secret = "mysecretkey";


var user1 = async function(req, res) {


  return await Player.find({}).exec();
};

var verifyUserExists = function( callback, username) {


  Player.findOne({ '_id': "5acbb688a60eff1a318400f1" }, function(err, doc) {
  path = doc;
    callback(doc);
  });

}
exports.renderBoard = async function(req, res) {
    console.log("rendering board");
    var authorization = req.headers.authorization;
    console.log("board"+ req.token);
    //var token = req.session.token;
    //console.log("Token from session"+ token);
    var players = await user1(req, res);
    res.render("board", {players: players});
};

exports.createPlayer =  async function(req, res,next) {
   // utils.verifyToken(req.headers.authorization);
   //await userHandler.isAuthorized(req, res, next).catch((err) => { console.log("errosr"); });
   //var authorization = req.headers.authorization;
   //console.log("Authorization"+authorization);
     //  if (!authorization) return res.status(403).send({success: false});
    try {
     /*   var decoded = jwt.decode(authorization, secret);
         if(decoded === null){
         res.sendStatus(401);
         } else {*/
            req.check('firstname', 'Player first name is required').notEmpty();
              req.check('lastname', 'Player last name is required').notEmpty();
              req.check('rating', 'Player rating is required').notEmpty();
              req.check('handedness', 'handedness is required').notEmpty();
              var errors = req.validationErrors();
              if(errors){
                //  return res.status(422).json({ errors: errors });
                res.render('player', { errors: errors });
              } else {

              var newPlayer = new Player(req.body);

                newPlayer.save(function(err, user) {
                  if (err) {
                    return res.status(400).send({
                      message: err,
                      success: false

                    });
                  } else {
                    return res.render("player",{ success: true, newPlayer });    }
                })
              }

         //}

    }catch (err) {
           res.sendStatus(409);
         }

  };

/*function myAsyncFunction(cb) {
  playerslist = Player.find({}, function (err, players) {
                                                  if (err) return res.status(500).send("There was a problem finding the users.")
                                                  else
                                                          console.log("Success player");
                                                         //console.log(players);
                                                          return players;
                                                        //  res.hea players;
                                                       // return cb(players);
                                                  //res.status(200).send(players);return next();
                                                //return res.json({ players });
                                                //res.setHeader("Content-Type", "application/json");
                                                //res.send(players );
                                                //next();
                                               // res.send(players);
                                              });
    // async things
    cb(false, { data: playerslist.exec() });
};*/
exports.listPlayers =  async function(req, res, next) {

    var user = await user1(req, res);

/*var  play ;
play = verifyUserExists( function(userExists) {
    console.log("user exists" + userExists);
    return userExists;
  }, "test");

        Player.find({}).lean().exec(function(err, results) {
            path = results;
            console.log(results);

        });*/
  console.log("**After"+user);

res.status(200).send(user)
  /*myAsyncFunction( function onComplete(error, data) {
    if (!error) {
        // hooray, everything went as planned
    } else {
        // disaster - retry / respond with an error etc
        console.log("Else");
        res.json(data);
    }
});*/
/*playerslist = getAllPlayers( );
console.log(playerslist);
res.send(getAllPlayers( ));*/


   /* Player.find({}, function (err, players) {
          if (err) return res.status(500).send("There was a problem finding the users.")
          else
                  console.log("Success player");
                //  res.hea players;

          //res.status(200).send(players);return next();
        //return res.json({ players });
        //res.setHeader("Content-Type", "application/json");
        //res.send(players );
        //next();
       // res.send(players);
      });*/
      /*getAllPlayers({

        }, function(err, data) {
          //reder view
          players: data
        });*/
        /*getAllPlayers(function(err, data){

                          return data;
        });*/
};
/*module.exports = function(){
  return playerslist;
};*/
function getAllPlayers( ) {
  //DB operation
   Player.find({}, function (err, players) {
            if (err) return res.status(500).send("There was a problem finding the users.")
            else
                    console.log("Success player");
                  //  res.hea players;
                  return players;
            //res.status(200).send(players);return next();
          //return res.json({ players });
          //res.setHeader("Content-Type", "application/json");
          //res.send(players );
          //next();
         // res.send(players);
        });

}

exports.deletePlayer = function(req, res) {

  Player.remove({
    _id: req.params.playerId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Player successfully deleted' });
  });
};

exports.user1 = user1;
