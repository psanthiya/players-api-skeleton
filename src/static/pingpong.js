  var socket = io();

  var constants = { court: { width: 0, height: 0, adjusted: false },
                    colors: { court: "brown", ball: "black", paddle: "orange", text: "blue" },
                    paddle: { width: 0, height: 0, delta: 0 },
                    ball: { radius: 0 },
                    player: { id: 0 }
                  };
  var state = { paddles: {},
                ball: { left: 0, top: 0 },
                sides: {}
              };
  var game_start = false;
  var
      canvas = document.getElementById("court"),
      ctx = canvas.getContext('2d');

var 	W = window.innerWidth, // Window's width
    		H = window.innerHeight; // Window's height

  socket.on('environment', function(data) {
    constants.court.width = data.court.width;
    constants.court.height = data.court.height;
    constants.paddle.delta = data.paddle.delta;
    constants.paddle.width  = data.paddle.width;
    constants.paddle.height  = data.paddle.height;
    constants.ball.radius = data.ball.radius;
    constants.player.id = data.player.id;
  });

  socket.on('paddles', function(data) {
 // alert("on paddles"+ state.paddles[constants.player.id]);
    var paddles = data.positions;
    // Overwrite the server's version of my own paddle position
    // if I already know where I am so I don't redraw in the old spot.
    if (state.paddles[constants.player.id])
      paddles[constants.player.id] = state.paddles[constants.player.id];
    state.paddles = paddles;
    state.sides = data.sides;
    if (!constants.court.adjusted) {
        constants.court.adjusted = true;
        if (state.sides.top == constants.player.id)
            canvas.className = 'topPlayer';
        else if (state.sides.left == constants.player.id)
            canvas.className = 'leftPlayer';
        else if (state.sides.right == constants.player.id)
            canvas.className = 'rightPlayer';
    }
  });

  socket.on('ball', function (data) {
    state.ball.left = data.position.left;
    state.ball.top = data.position.top;
    drawCanvas();
  });
/*init = function() {

  ctx.fillStyle = 'rgb(255,255,255)';
     			ctx.font = 'bold 25px Arial';
     			ctx.fillText('Start', canvas.width / 2 - 40, canvas.height / 2);
                canvas.addEventListener("mousedown", btnClick, true);

  //alert("**Game start");
  //this.game_start = true;
  //ctx.arc( state.ball.left, state.ball.top, constants.ball.radius, 0, Math.PI * 2 );
  //ctx.fill();
  };*/


  // Start Button object
  startBtn = {
  	w: 80,
  	h: 50,
  	x: W/2 - 350,
  	y: H/2 - 100,

  	draw: function() {
  	ctx.beginPath();
  		ctx.strokeStyle = "black";
  		ctx.lineWidth = "2";
  		ctx.strokeRect(this.x, this.y, this.w, this.h);

  		ctx.font = "18px Arial, sans-serif";
  		ctx.textAlign = "center";
  		ctx.textBaseline = "middle";
  		ctx.fillStyle = constants.colors.text;
  		ctx.fillText("Start", 290,295 );
  		ctx.fill();
  	}
  };


  var drawCanvas = function() {
    canvas.width = constants.court.width;
    canvas.height = constants.court.height;
    ctx.fillStyle = constants.colors.court;
    ctx.fillRect(0, 0, constants.court.width, constants.court.height);

  if(game_start){

      ctx.fillStyle = constants.colors.paddle;
      ctx.fillRect((state.paddles[state.sides.bottom] / 100 * constants.court.width) - (constants.paddle.width / 2),
                   constants.court.height - constants.paddle.height, constants.paddle.width, constants.paddle.height);
      ctx.fillRect((state.paddles[state.sides.top] / 100 * constants.court.width) - (constants.paddle.width / 2),
                   0, constants.paddle.width, constants.paddle.height);
      ctx.fillRect(0, (state.paddles[state.sides.left] / 100 * constants.court.height) - (constants.paddle.height / 2),
                   constants.paddle.height, constants.paddle.width);
      ctx.fillRect(constants.court.width - constants.paddle.height,
                   (state.paddles[state.sides.right] / 100 * constants.court.height) - (constants.paddle.height / 2),
                   constants.paddle.height, constants.paddle.width);
      ctx.fillStyle = constants.colors.ball;
      ctx.beginPath();

    ctx.arc( state.ball.left, state.ball.top, constants.ball.radius, 0, Math.PI * 2 );
    ctx.fill();
  }
    else{
    startBtn.draw();
    canvas.addEventListener("mousedown", btnClick, true);
}
   // alert(game_start);
   // if(game_start){
    //alert("*if");
   // ctx.arc( state.ball.left, state.ball.top, constants.ball.radius, 0, Math.PI * 2 );
   //                           ctx.fill();


  };
  var movePaddle = function (delta) {
 // alert("player id" + constants.player.id)
    var newLeft = state.paddles[constants.player.id] + delta;
    if (newLeft >= 100)
      newLeft = 100;
    else if (newLeft <= 0)
      newLeft = 0;
    if (newLeft != state.paddles[constants.player.id]) {
      state.paddles[constants.player.id] = newLeft;
      socket.emit('paddle', {left: state.paddles[constants.player.id] });
      drawCanvas();
    }
  };
  window.addEventListener('keydown', function onKeyDown(aEvent) {
    switch (aEvent.which) {
      case 37: // Left
        if (state.sides.top == constants.player.id || state.sides.right == constants.player.id) movePaddle(constants.paddle.delta);
        else movePaddle(-constants.paddle.delta);
        break;
      case 39: // Right
        if (state.sides.top == constants.player.id || state.sides.right == constants.player.id) movePaddle(-constants.paddle.delta);
        else movePaddle(constants.paddle.delta);
        break;
    }
  }, false);

function btnClick(e) {


// Variables for storing mouse position on click
	var mx = e.pageX,
	my = e.pageY;

	// Click start button

	if( mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {

        game_start = true;
        startBtn = {};

	}
	alert(game_start);
	drawCanvas();
};
