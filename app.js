var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var socketio = require('socket.io');
var mongojs = require('mongojs');
var db = mongojs('autiondata',['products']);
require('./models/Posts');
require('./models/Comments');
require('./models/User');

require('./config/passport');



mongoose.connect('mongodb://localhost/autiondata');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').createServer(app);
var io = socketio.listen(server);
server.listen(3000);
// view engine setup
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
//app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user	



//
// COUNT DOWN FUNCTIONS
//
var deadline = new Date(Date.parse(new Date()) + 36000 * 1000);

function initTimer()
{
	
	db.products.find(function (err, docs) {
	// docs is an array of all the documents in mycollection 
	docs.forEach(function(item){
         
		
		 d = getTimeRemaining(item.dateEnd);
		  if (d.total > 0) 
			{
				//console.log(d);
			  io.sockets.emit('timeCount',item._id, d);
			}
		  else 
			{
				db.products.findAndModify({
				query: { _id: mongojs.ObjectId(item._id.toString()) },
				update: { $set: { isBID:1} },
				new: true
				}, function (err, doc, lastErrorObject) {
					// doc.tag === 'maintainer'
				});
			  
			  io.sockets.emit('timeCount',item._id, {'days': 0, 'hours': 0, 'minutes': 0, 'seconds': 0});
			  io.sockets.emit('timeOut',item._id, 'Time Out');
			  //clearInterval(interval);
			}
			   });
			});
  
}

var interval = setInterval(initTimer, 1000);

function getTimeRemaining(endtime) {	
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));

  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

//
// SOCKET FUNCTIONS
//
io.sockets.on('connection', function(socket) {
  socket.on('new auction', function(id,data,userBID) {
    var currentPrice;
	var numberBID;
	var price;
    console.log(data);
    
   db.products.find(function(err,docs){
         
      currentPrice = 0;
	  price =  0;
	  numberBID = 0;
       docs.forEach(function(item){
         
		 if(item._id == id){
            currentPrice = item.costCurent; 
			numberBID = item.numberBID;
			price = item.price;
		 }
       });
 
        if (data < currentPrice) {
          socket.emit('timeOut', "Your price must be greater than the original value");
        }
        else if (data > currentPrice && data < price ) {

		db.products.findAndModify({
			query: { _id: mongojs.ObjectId(id.toString()) },
			update: { $set: { costCurent:parseInt(data), numberBID: numberBID+1,idUSer: userBID  } },
			new: true
		}, function (err, doc, lastErrorObject) {
			// doc.tag === 'maintainer'
		});
          io.sockets.emit('new price', data);
          
        }else if (data > currentPrice && data >= price ) {
		db.products.findAndModify({
			query: { _id: mongojs.ObjectId(id.toString()) },
			update: { $set: { costCurent:parseInt(data), numberBID: numberBID+1,isBID:1,idUSer: userBID  } },
			new: true
		}, function (err, doc, lastErrorObject) {
			 
		})
           
          io.sockets.emit('new price', data);
          
        }
   });
  
   
  });
  

  initTimer();
});
module.exports = app;
