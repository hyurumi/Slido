
/**
 * Module dependencies.
 */

var express     = require('express')
  , routes      = require('./routes')
  , http        = require('http')
  , path        = require('path')
  , redis       = require('redis')
  , socketio    = require('socket.io')
  , redisClient = redis.createClient()
  , app         = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//IO server 
var io;
var io_port = 9090;
if(process.env.NODE_ENV === "production")
  io = socketio.listen(io_port ,{ 'log level': 1 });
else
  io = socketio.listen(io_port);

// Controller modules
['index', 'dist', 'plusview'].forEach(function(routeName) {
  require('./routes/' + routeName)(app, redisClient);
});


// DB settings
redisClient.on("error", function (err) {
  console.log("Error " + err);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


io.of("/presentation").on("connection", function(socket){
  var address = socket.handshake.address;
  
  // if no emittion, will not be fired
  socket.on("connect", function(dataObject){
    console.log(address.address + " connect..");
  });

  socket.on("nextSlide", function(dataObject){
    console.log(dataObject)
    socket.broadcast.emit('nextSlide', dataObject);
  });

  socket.on("previsousSlide", function(dataObject){
    socket.broadcast.emit('previousSlide', dataObject);
  });

  //END CONNECTION
  socket.on("disconnect", function(){
    console.log(address.address + " disconnect..");
  });
});
