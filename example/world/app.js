/**
* Module dependencies.
*/
 
var express  = require('express'),
    resource = require('express-resource'),
    http     = require('http'),
    path     = require('path'),
    dbConfig = require('./lib/dbconfig'),
    factory  = require('./lib/ndbcfactory');
 
var app = express();
 
app.configure(function(){
   
  var type = 'mysql';
  var config = new dbConfig();
  config.host     = 'localhost';
  config.port     = '3306';
  config.user     = 'root';
  config.password = 'root';
  config.database = 'world';
     
  var dbconn = factory.create(config, type);
  dbconn.createpool();
   
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next){
    // share db connection
    req.dbconn = dbconn;
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
 
// load rest api
require('./lib/rest')(app, { verbose: !module.parent });
 
 
app.configure('development', function(){
  app.use(express.errorHandler());
});
 
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

