var Match = require('../../src/models/match');
var Player = require('../../src/models/player');
var ObjectId = require('mongoose').Types.ObjectId;
var playerHandler = require('../../src/controllers/PlayerController');
var auth = require('../../src/utils/Utils');


exports.createMatch = async function (req, res, next) {
  var token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ success: false });
  } else {
    var user = await auth.authUser(token);
    if (user != null) {
      var firstPlayer = await Player.findOne({ _id: ObjectId(req.body.firstPlayer) });
      var secondPlayer = await Player.findOne({ _id: ObjectId(req.body.secondPlayer) });

      if (firstPlayer === null || secondPlayer === null) {
        return res.status('409').send('Player  ' + req.body.firstPlayer + '/ ' + req.body.secondPlayer + '  not exists');
      } else if (firstPlayer.created_by != user.id || secondPlayer.created_by != user.id) {
        return res.status('409').send('Can\'t choose player created by other user');
      } else if (req.body.matchwinner != req.body.firstPlayer && req.body.matchwinner != req.body.secondPlayer) {
        return res.status('409').send('Match winner should be one among the two players.');
      } else {
        var matchObj = new Match(req.body);
        matchObj.createdBy = user.id;
        matchObj.save(function (err, match) {
          if (err) {
            return res.status(409).send({
              message: err,
              success: false

            });
          } else {
            res.status(201).json({ success: true, match: match });
            deriveRating(firstPlayer, secondPlayer, match);
          }
        });
      }
    } else {
      return res.status(403).send({ success: false });
    }
  }

};

exports.getMatches = async function (req, res) {
  var token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ success: false });
  } else {
    var user = await auth.authUser(token);
    if (user != null) {
      var matches = await Match.find({ createdBy: user.id });
      res.status(200).json({ success: true, matches: matches });
    } else {
      return res.status(403).send({ success: false });

    }

  }
};

exports.getPlayerMatchDetails = async function (req, res) {
  var playerId = req.params.playerId;
  var token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ success: false });
  } else {
    var user = await auth.authUser(token);
    if (user != null) {
      var matches = await Match.find({
        '$or': [{
          'firstPlayer': playerId
        }, {
          'secondPlayer': playerId
        }]
      });
      if (matches.length === 0) {
        return res.status(404).send({ success: false, message: "Player not found/Player din't play any matches" });
      }
      var totalMatches = matches.length;
      var winningMatches = [];
      matches.forEach(match => {
        if (match.matchwinner === playerId) {
          winningMatches.push(match);
        }
      });
      var winPercent = (winningMatches.length / totalMatches) * 100;
      var factor = Math.pow(10, 1);
      var winPercentRounded = Math.round(winPercent * factor) / factor;
      return res.status(200).send({ success: true, totalMatches: totalMatches, totalWins: winningMatches.length, winPercent: winPercentRounded });
    } else {
      return res.status(403).send({ success: false });

    }

  }
};


exports.getRankings = async function (req, res) {
  //Get all players
  //for each player get all matches
  //calculate winning percentage ( calculate total games and then win games)
  //arrange players based on the win percentage
  var rankings = [];
  var players = await Player.find({}).exec();
  for (var player of players) {
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
    var winPercent = (totalWins / totalMatches) * 100;
    var factor = Math.pow(10, 1);
    var winPercentRounded = Math.round(winPercent * factor) / factor;
    var rank = 0;
    var rankDetails = { player: player, winPercent: winPercent, rank: rank };
    rankings.push(rankDetails);
    //arrange players
    rankings.sort(function (a, b) {
      return parseFloat(b.winPercent) - parseFloat(a.winPercent);
    });
    for (var ranking of rankings) {
      ranking.rank = ++rank;
    }

  };
  res.status(200).json({ "rankings": rankings });

};

var deriveRating = async function (firstPlayer, secondPlayer, match) {
  var pointSpread;
  var firstPlayerRating = firstPlayer.rating;
  var secondPlayerRating = secondPlayer.rating;
  var highRatedPlayer;

  //calculate point spread and identify high rated player
  if (firstPlayerRating > secondPlayerRating) {
    pointSpread = firstPlayerRating - secondPlayerRating;
    highRatedPlayer = firstPlayer;
  } else {
    pointSpread = secondPlayerRating - firstPlayerRating;
    highRatedPlayer = secondPlayer;
  }
  var exchangePoints = getExchangedPoints(pointSpread, highRatedPlayer, match.matchwinner);
  var calculatedRating;
  if (firstPlayer.id === match.winner) {
    calculatedRating = firstPlayer.rating + exchangePoints.valueOf();
  } else {
    calculatedRating = secondPlayer.rating + exchangePoints.valueOf();
  }
  var updatePlayer;
  if (match.matchwinner === firstPlayer.id) {
    updatePlayer = firstPlayer;
  } else {
    updatePlayer = secondPlayer;
  }

  var query = { _id: updatePlayer.id };
  var update = updatePlayer;
  update.id = match.matchwinner;
  update.rating = calculatedRating.valueOf();
  var options = { new: true, upsert: true };
  var user = await Player.findOneAndUpdate(query, update, options);

};


function getExchangedPoints(pointSpread, highRatedPlayer, winner) {
  var exchangePoints = 0;
  if (pointSpread >= 0 && pointSpread < 12) {
    exchangePoints = 8;
  } else if (pointSpread >= 13 && pointSpread < 37) {
    if (highRatedPlayer === winner) {
      exchangePoints = 7;
    } else {
      exchangePoints = 10;
    }
  } else if (pointSpread >= 38 && pointSpread < 62) {
    if (highRatedPlayer === winner) {
      exchangePoints = 6;
    } else {
      exchangePoints = 13;
    }
  } else if (pointSpread >= 63 && pointSpread < 87) {
    if (highRatedPlayer === winner) {
      exchangePoints = 5;
    } else {
      exchangePoints = 16;
    }
  } else if (pointSpread >= 88 && pointSpread < 112) {
    if (highRatedPlayer === winner) {
      exchangePoints = 4;
    } else {
      exchangePoints = 20;
    }
  } else if (pointSpread >= 113 && pointSpread < 137) {
    if (highRatedPlayer === winner) {
      exchangePoints = 3;
    } else {
      exchangePoints = 25;
    }
  } else if (pointSpread >= 138 && pointSpread < 162) {
    if (highRatedPlayer === winner) {
      exchangePoints = 2;
    } else {
      exchangePoints = 30;
    }
  } else if (pointSpread >= 163 && pointSpread < 187) {
    if (highRatedPlayer === winner) {
      exchangePoints = 2;
    } else {
      exchangePoints = 35;
    }
  } else if (pointSpread >= 188 && pointSpread < 212) {
    if (highRatedPlayer === winner) {
      exchangePoints = 1;
    } else {
      exchangePoints = 40;
    }
  } else if (pointSpread >= 213 && pointSpread < 237) {
    if (highRatedPlayer === winner) {
      exchangePoints = 1;
    } else {
      exchangePoints = 45;
    }
  } else if (pointSpread >= 238) {
    if (highRatedPlayer === winner) {
      exchangePoints = 0;
    } else {
      exchangePoints = 50;
    }
  }
  return exchangePoints;
}
