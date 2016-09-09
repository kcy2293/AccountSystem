global.env = process.env.NODE_ENV || 'production';
global.__base = __dirname + '/';
/*******************
 * modules
 *******************/
var express = require('express'),
		path = require('path'),
		favicon = require('serve-favicon'),
		logger = require('morgan'),
		cookieParser = require('cookie-parser'),
		bodyParser = require('body-parser'),
		http = require('http'),
		compression = require('compression'),
		multer = require('multer');

/*******************
 * setup express
 *******************/
var app = express();
var port = '5000';
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'bower_components'), {maxAge: 365*24*60*60*1000}));
/*******************
 * routing
 *******************/
var userRouter = require('./routes/users/users.router'),
		authRouter = require('./routes/auth/auth.router'),
		reservRouter = require('./routes/reservation/reserv.router'),
		accountRouter = require('./routes/account/account.router'),
		settingRouter = require('./routes/setting/setting.router');

app.get('/', function(req, res) {
  res.redirect('/index.html');
  //res.redirect('/test.html');
});

app.use('/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/reservation', reservRouter);
app.use('/api/account', accountRouter);
app.use('/api/setting', settingRouter);

/*******************
 * upload file
 *******************/
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'views/img/decoImages')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({
  storage: storage
}).array('files[]');
 /*
var uploadDecoImage = multer({
  dest: 'views/img/decoImages'
});
*/
app.post('/decoImage', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      res.json(err);
      return;
    }
    res.json({
			message: "uploaded!"
		});
  })
});

/*******************
 * database
 *******************/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var config = require('./config');
mongoose.connect(config.db.uri, config.db.options, function(err) {
  if (err) {
    console.log('mongodb err : '+ err);
    throw err;
  }
});

/*******************
 * http server open
 *******************/
var httpServer = http.createServer(app);
httpServer.listen(port, function() {
  console.log("HTTP Server listening on port " + app.get('port'));
});
