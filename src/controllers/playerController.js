//var mongoose = require('mongoose'),
var jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');
var Player = require('../../src/models/player');
var bodyParser = require('body-parser');
var path;
var utils = require('../../src/utils/Utils.js');
const secret = "mysecretkey";
var ObjectId = require('mongoose').Types.ObjectId;


var getAllPlayers = async function(req, res) {
  return await Player.find({}).exec();
};

exports.renderBoard = async function(req, res) {
    console.log("rendering board");
    var authorization = req.headers.authorization;
    var players = await user1(req, res);
    res.render("board", {players: players});
};

exports.createPlayer =  async function(req, res,next) {
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
            var user = jwt.decode(req.headers.authorization.slice(7));
                req.check('first_name', 'Player first name is required').notEmpty();
                  req.check('last_name', 'Player last name is required').notEmpty();
                  req.check('rating', 'Player rating is required').notEmpty();
                  req.check('handedness', 'handedness is required').notEmpty();
                  var errors = req.validationErrors();
                  if(errors){
                      return res.status(409).json({ errors: errors });
                  } else {

                    var newPlayer = new Player(req.body);
                    newPlayer.created_by = user.id;
                    newPlayer.save(function(err, player) {
                      if (err) {
                        return res.status(409).send({
                          message: err,
                          success: false

                        });
                      } else {
                        return res.status(201).json( {success: true, player: player});
                        }
                    });
                  }
          }

  };


exports.listPlayers =  async function(req, res, next) {
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
                var user = jwt.decode(req.headers.authorization.slice(7));
                var players = await Player.find({created_by: user.id});
                res.status(200).json({success: true,players: players});
            }
};

exports.deletePlayer = async function(req, res) {
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
             var user = jwt.decode(req.headers.authorization.slice(7));
             var existingPlayer = await Player.findOne({_id: ObjectId(req.params.id)});
             if (!existingPlayer){
                return res.status(404).json({success: false, message : "Player doesn't exist"});
             } else {
              if (existingPlayer.created_by !== user.id){
                return res.status(404).json({success: false, message : "Can't delete player created by other user"});
              } else {
              Player.remove({
                               _id: ObjectId(req.params.id)
                             }, function(err, task) {
                               if (err)
                                 res.send(err);
                               res.status(200).json({ message: 'Player successfully deleted' });
                             });
                           };
              }
              }
             };






exports.getAllPlayers = getAllPlayers;
