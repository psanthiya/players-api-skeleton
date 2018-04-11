var express = require('express');
var router = express.Router();

var path = require('path');

router.get('/match', function (req, res) {
    //res.render("match");
   // res.sendFile('../../src/views/match.html');
   //res.sendFile('./src/views/pingpong.html');
         res.sendFile(path.resolve('./src/views/match.html'));

   //res.render("match");
});

module.exports = router;
