var express = require('express');
var db = require('../../src/config/db');
var expressValidator     = require('express-validator');
var app = express();
var bodyParser = require('body-parser');
//var http = require('http');
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
});

var userRoute = require('../../src/routes/userRoute');
var playerRoute = require('../../src/routes/playerRoute');
var matchRoute = require('../../src/routes/matchRoute');
//userRoute(app);


app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(expressValidator());
console.log(__dirname);
app.use('/static', express.static( './src/static'));
app.use(express.static(__dirname + '/public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');
//app.set('view engine', 'html')
app.use('/api', userRoute);
app.use('/', userRoute);

app.use('/api', playerRoute);

//app.use('/api/user', userRoute);
//app.use('/api/login', userRoute);

app.use(function(req, res,next) {
console.log("**************HERE"+req.headers);
next();
});



module.exports = app;

/*
module.exports = {
  Player: {},
  User: {}
};
*/
