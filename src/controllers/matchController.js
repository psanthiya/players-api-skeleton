var jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');
var Match = require('../../src/models/match');
var Player = require('../../src/models/player');
var ObjectId = require('mongoose').Types.ObjectId;


exports.createMatch =  async function(req, res,next) {
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
            var user = jwt.decode(req.headers.authorization.slice(7));
            console.log(user.id);
             var firstPlayer = await Player.findOne({_id: ObjectId(req.body.firstPlayer)});
             var secondPlayer = await Player.findOne({_id: ObjectId(req.body.secondPlayer)});

                if (firstPlayer === null || secondPlayer === null) {
                  return res.status('409').send('Player'+ firstPlayer +'/'+ secondPlayer + 'not exists');
                } else if(firstPlayer.created_by != user.id || secondPlayer.created_by != user.id) {
                  return res.status('409').send('Can\'t choose player created by other user');
                  } else {
                    var matchObj = new Match(req.body);
                    matchObj.createdBy = user.id;
                     matchObj.save(function(err, match) {
                                          if (err) {
                                            return res.status(409).send({
                                              message: err,
                                              success: false

                                            });
                                          } else {
                                            return res.status(201).json( {success: true, match: match});
                                            }
                                        })
                  }
                }
};

exports.getMatches =  async function(req, res) {
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
           var user = jwt.decode(req.headers.authorization.slice(7));
           var matches = await Match.find({createdBy: user.id});
           res.status(200).json({success: true, matches: matches});
          }
};

exports.getPlayerMatchDetails = async function(req, res) {
         var playerId = req.params.playerId;
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
            var matches = await Match.find({
                 '$or': [{
                   'firstPlayer': playerId
                 }, {
                   'secondPlayer': playerId
                 }]
               });
            var totalGames = matches.length;
            var winGames = [];
            matches.forEach(match => {
                  if (match.matchwinner === playerId) {
                    winGames.push(match);
                  }
                });
             var winPercent = (winGames.length/totalGames) * 100;
             var factor = Math.pow(10, 1);
             var winPercentRounded = Math.round(winPercent * factor) / factor;
             return res.status(200).send({success: true, totalGamesPlayed: totalGames, totalGamesWon: winGames.length, winPercent: winPercentRounded });
          }
};
