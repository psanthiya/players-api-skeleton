var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var player = require('../../src/models/player');
var playerHandler = require('../../src/controllers/playerController.js');
var path = require('path');

router.route('/players')
		.post( playerHandler.createPlayer);


router.get('/player', function (req, res) {
    console.log("create "+req.body.token);
    console.log("create "+req.headers.authorization);
    res.render("player");
});


router.route('/players')
    		.get( playerHandler.listPlayers);

router.route('/players/:playerId')
    		.delete( playerHandler.deletePlayer);
router.get('/players/pingpong', function (req, res) {
    res.sendFile(path.resolve(path.join('./src/views/','pingpong.html')));
});

router.route('/board').get(playerHandler.renderBoard);

module.exports = router;
