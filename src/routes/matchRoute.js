var express = require('express');
var router = express.Router();
var matchHandler = require('../../src/controllers/matchController.js');

router.route('/match')
		.post( matchHandler.createMatch);

router.route("/matches")
		.get(matchHandler.getMatches);

router.route('/match/:playerId')
		.get( matchHandler.getPlayerMatchDetails);

module.exports = router;
