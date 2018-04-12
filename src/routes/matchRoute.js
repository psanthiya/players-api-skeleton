var express = require('express');
var router = express.Router();
var matchHandler = require('../../src/controllers/matchController.js');

router.route('/match')
		.post( matchHandler.createMatch);

router.route("/matches")
		.get(matchHandler.getMatches);

router.route('/matches/:playerId')
		.get( matchHandler.getPlayerMatchDetails);

router.route('/rankings')
		.get( matchHandler.getRankings);

module.exports = router;
