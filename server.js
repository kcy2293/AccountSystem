global.env = process.env.NODE_ENV || 'production';
/*******************
 * modules
 *******************/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

/*******************
 * setup express
 *******************/
var app = express();
var port = '3000';
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'bower_components')));
/*******************
 * routing
 *******************/
 app.get('/', function(req, res) {
   res.redirect('/index.html');
   //res.redirect('/test.html');
 });

/*******************
 * http server open
 *******************/
var httpServer = http.createServer(app);
httpServer.listen(port, function() {
  console.log("HTTP Server listening on port " + app.get('port'));
});
