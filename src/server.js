var http = require('http');
var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var server = http.Server(app);

var db = require('./config/db');
var expressValidator     = require('express-validator');
var bodyParser = require('body-parser');
var http = require('http').Server(app);

var userRoute = require('./routes/userRoute');
var playerRoute = require('./routes/playerRoute');
var matchRoute = require('./routes/matchRoute');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(expressValidator());


app.use('/api', userRoute);
app.use('/api', playerRoute);
app.use('/api', matchRoute);

server.listen(port, function() {
  console.log('Server starts on port ' + port);
});


module.exports = app;
