var express = require('express');	
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var logger = require('morgan');
var port = 3000;
var dbPath = 'mongodb://localhost/tutor';

//Connecting to mongoose
var mongoose = require('mongoose');
mongoose.connect(dbPath);

var app = express();

//serving static files in public directory
app.use(express.static('public'));

//Configuring passport authentication here
require('./config/passport.js')(passport);
	
  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
	extended: true
  }));
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(expressSession({ 
			secret: 'mujtaba rox' ,
			saveUninitialized: true,
                 resave: true
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  
//Sets up the routes that the server accepts
require('./routes.js')(app, passport);
												
//Starts server at given port number

var server;

var start = exports.start = function start(port, callback){
  server = app.listen(port, callback);
};
app.listen(port);
var end = exports.end = function end(callback){
  server.close(callback);
};


console.log("Starting Tutors 4 U Server at port" + port + "!");