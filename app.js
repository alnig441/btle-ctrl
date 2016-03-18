var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var pg = require('pg'),
    connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';


var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var admin = require('./routes/admin');
var panel = require('./routes/panel');
var options = require('./routes/options');
var profiles = require('./routes/profiles');
var cronjobs  = require('./routes/cronjobs');
var jobs = require('./routes/jobs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/admin', admin);
app.use('/panel', panel);
app.use('/options', options);
app.use('/profiles', profiles);
app.use('/cronjobs', cronjobs);
app.use('/jobs', jobs);


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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// set up app to pull sunrise/sunset data
var date = new Date();
date.setDate(date.getDate()+1);
date.setHours(1);
date.setMinutes(0);
date.setSeconds(0);

var delay = date - new Date();

var incr = 0;

var options = {
  host: 'api.sunrise-sunset.org',
  path: '/json?lat=44.891123.7201600&lng=-93.359752&formatted=0'
};

callback = function(response){
  var obj = {};
  var props = [];
  var values = [];

  response.on('data', function(data){
    obj = JSON.parse(data);
  });

  response.on('end', function(){

    for(var prop in obj.results){
      var x = "'";
        if(obj.results[prop] !== null ){
          props.push(prop);
          x += obj.results[prop];
          x += "'";
          values.push(x);
        }
        if(obj.results[prop] === null){
          props.push(prop);
          values.push('null');
        }

    }

    if(incr <= 1 ){

      pg.connect(connectionString, function(err, client, done){

        var query = client.query("INSERT INTO sundata ("+ props.toString()+") values("+values.toString()+")", function(error, result){
          if(error){res.send(error);}
        })
      })

    }
    else {

      pg.connect(connectionString, function(err, client, done){

        var query = client.query("UPDATE sundata SET ("+ props.toString()+") = ("+values.toString()+")", function(error, result){
          if(error){res.send(error);}
        })
      })

    }


  });
  incr++;
};

function refreshSunData(){
  console.log('refreshing sundata daily: ', new Date());
  http.get(options, callback).end();

}

var outer = setTimeout(function(){
  console.log('refreshing sundata on load: ', new Date());
  http.get(options, callback).end();

  var inner = setTimeout(function(){
    console.log('refreshing sundata after initial delay: ', new Date());
    setInterval(refreshSunData, 86400000);
    clearTimeout(inner);

  }, delay);

  clearTimeout(outer);
});

module.exports = app;
