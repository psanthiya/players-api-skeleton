var app = require('./models/index');
var http = require('http');




var port = process.env.PORT || 3000;
var socketIO = require('socket.io');

var server = http.Server(app);
var io = socketIO(server);

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

var constants = { court: { width: 600, height: 600 },
                  paddle: { width: 50, height: 15, delta: 3 },
                  ball: { radius: 10, deltaLeft: 3, deltaTop: 2, interval: 30 }
                };

var state = { paddles: {},
              ball: { left: 0, top: 0 },
              bottomPaddle: 0,
              topPaddle: 0,
              leftPaddle: 0,
              rightPaddle: 0
            };

var serverState = { intervalId: 0,
                    connections: 0
                  };



/*
io.on('connection', function(socket) {
console.log('a user connected');
 */
/*socket.on('disconnect', function(){
    console.log('user disconnected');
  });*//*

  // players = {name: 'player1'+connected,  x:0,y:0};
   //connection ={p:players,s:socket};
   //connected++;
  */
/*socket.on('new player', function() {
    console.log("new player event emitted by client"+socket.id);
     players[socket.id] = {
          x: 300,
          y: 300
        };
  });*//*


  socket.on('new player',function(state_data){ // Listen for new-player event on this client
        console.log("New player has state:",state_data);
        socket.broadcast.emit('create-player',state_data);
      });

  // this handle the MOUSE OVER message, from the V&D
 */
/*    socket.on('mouseover', function (data) {
     //console.log("Server data" + data)
         var connectedUser = io.sockets.in(data);
         if (connectedUser != null)
             connectedUser.emit('newhighlight', data);
     });*//*


      socket.on('movement', function (data) {
        var player = players[socket.id] || {};
        player.pingpong = data;
      });
 // socket.emit('new player', players);
});

*/
/*
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
*//*

setInterval(function() {
  io.sockets.emit('state', players
  );
}, 1000 / 60);*/

io.sockets.on('connection', function (socket) {

    var paddleAdded = false;
    console.log(state.bottomPaddle + "---" + state.topPaddle + "---" + state.rightPaddle)
    if (!state.bottomPaddle) {
        state.bottomPaddle = socket.id;
    } else if (!state.topPaddle) {
        state.topPaddle = socket.id;
    } else if (!state.leftPaddle) {
        state.leftPaddle = socket.id;
    } else if (!state.rightPaddle) {
        state.rightPaddle = socket.id;
    } else {
      // placeholder for fifth player
      return;
    }

    state.paddles[socket.id] = 50;

    socket.emit('environment', { court:  {  width:  constants.court.width,
                                            height: constants.court.height,
                                         },
                                 paddle: {  width: constants.paddle.width,
                                            height: constants.paddle.height,
                                            delta: constants.paddle.delta
                                         },
                                 ball: { radius: constants.ball.radius },
                                 player: { id: socket.id }
    });

    if ( !serverState.intervalId ) {
        serverState.intervalId = setInterval( function(){
            calculateBallPosition();
        }, constants.ball.interval );
    }

    socket.intervalId = setInterval( function(){
        socket.emit('ball', { position: { left: state.ball.left, top: state.ball.top } });
        socket.emit('paddles', { positions: state.paddles, sides: {bottom: state.bottomPaddle, top: state.topPaddle, left: state.leftPaddle, right: state.rightPaddle }});
    }, constants.ball.interval );

    socket.on('paddle', function (data) {
        state.paddles[socket.id] = data.left;
    });

    socket.on('disconnect', function () {
        serverState.connections--;
        clearInterval( socket.intervalId );
        delete state.paddles[socket.id];

        if (state.bottomPaddle == socket.id)
            state.bottomPaddle = 0;
        else if (state.topPaddle == socket.id)
            state.topPaddle = 0;
        else if (state.leftPaddle == socket.id)
            state.leftPaddle = 0;
        else if (state.rightPaddle == socket.id)
            state.rightPaddle = 0;
        if ( serverState.connections == 0 ) {
            clearInterval( serverState.intervalId );
            serverState.intervalId = 0;
        }
        console.log('player left');
    });

    console.log(serverState.connections);
    serverState.connections++;
});

function calculateBallPosition() {
    var left = state.ball.left + constants.ball.deltaLeft;
    var top = state.ball.top + constants.ball.deltaTop;

    if (left >= constants.court.width) {
        left = constants.court.width;
        constants.ball.deltaLeft = -constants.ball.deltaLeft;
    } else if (left <= 0) {
        left = 0;
        constants.ball.deltaLeft = -constants.ball.deltaLeft;
    }
    if (top + constants.ball.radius >= constants.court.height - constants.paddle.height) {
        if (state.bottomPaddle &&
            left > ( (state.paddles[state.bottomPaddle]/100) * constants.court.width - constants.paddle.width / 2) &&
            (left < ( (state.paddles[state.bottomPaddle]/100) * constants.court.width + constants.paddle.width / 2) ) ) {
            top = constants.court.height - constants.paddle.height - constants.ball.radius;
            constants.ball.deltaTop = -constants.ball.deltaTop;
        } else {
            //TODO: #1
            left = constants.court.width / 2;
            top = constants.court.height / 2;
        }
    } else if (top <= 0) {
        top = 0;
        constants.ball.deltaTop = -constants.ball.deltaTop;
    }
    state.ball.left = left;
    state.ball.top = top;
};
