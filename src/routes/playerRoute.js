var express = require('express');
var router = express.Router();
var playerHandler = require('../../src/controllers/PlayerController.js');

router.route('/players')
		.post( playerHandler.createPlayer);

router.route('/players')
    		.get( playerHandler.listPlayers);

router.route('/players/:id')
    		.delete( playerHandler.deletePlayer);

module.exports = router;
