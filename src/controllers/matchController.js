var jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');
var Match = require('../../src/models/match');
var Player = require('../../src/models/player');
var ObjectId = require('mongoose').Types.ObjectId;
var playerHandler = require('../../src/controllers/PlayerController');


exports.createMatch =  async function(req, res,next) {
         var token = req.headers.authorization;
         if (!token){
             return res.status(403).send({success: false});
          } else {
            var user = jwt.decode(req.headers.authorization.slice(7));
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
            if(matches.length === 0){
              return res.status(404).send({success: false, message: "player not found/player din't play any matches"});
            }
            var totalMatches = matches.length;
            var winningMatches = [];
            matches.forEach(match => {
                  if (match.matchwinner === playerId) {
                    winningMatches.push(match);
                  }
                });
             var winPercent = (winningMatches.length/totalMatches) * 100;
             var factor = Math.pow(10, 1);
             var winPercentRounded = Math.round(winPercent * factor) / factor;
             return res.status(200).send({success: true, totalMatches: totalMatches, totalWins: winningMatches.length, winPercent: winPercentRounded });
          }
};


exports.getRankings = async function(req, res) {
//Get all players
//for each player get all matches
//calculate winning percentage ( calculate total games and then win games)
//arrange players based on the win percentage
            var rankings = [];
            var players = await Player.find({}).exec();
            for(var player of players)  {
             var matches = await Match.find({
                              '$or': [{
                                'firstPlayer': player.id
                              }, {
                                'secondPlayer': player.id
                              }]
                            });
              var winningMatches = [];
                          matches.forEach(match => {
                                if (match.matchwinner === player.id) {
                                  winningMatches.push(match);
                                }
                              });
              var totalMatches = matches.length;
              var totalWins = winningMatches.length;
              var winPercent = (totalWins/totalMatches) * 100;
              var factor = Math.pow(10, 1);
              var winPercentRounded = Math.round(winPercent * factor) / factor;
              var rank = 0;
              var rankDetails = {player: player, winPercent: winPercent, rank: rank};
              rankings.push(rankDetails);
              //arrange players
              rankings.sort(function(a, b) {
                      return parseFloat(b.winPercent) - parseFloat(a.winPercent);
                    });
              for(var ranking of rankings){
                ranking.rank = ++rank;
              }

            };
            res.status(200).json({"rankings":rankings});

};


