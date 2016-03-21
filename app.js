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
var sundata = require('./routes/sundata');

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
app.use('/sundata', sundata);


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

var HTTPoptions = {
  sun_data: {
    host: 'api.sunrise-sunset.org',
    path: '/json?lat=44.891123.7201600&lng=-93.359752&formatted=0'
    },
  run_profiles: {
    port: process.env.PORT || '3000',
    path: '/options/profile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  get_profiles: {
    port: process.env.PORT || '3000',
    path: '/profiles'
  }
};


sunData_cb = function(response){
  var obj = {};
  var props = [];
  var values = [];

  response.on('data', function(data){
    obj = JSON.parse(data);
  });

  response.on('end', function(event){

    for(var prop in obj.results){
      var x = "'";
        if(typeof obj.results[prop] === 'string' ){
          var temp = obj.results[prop].slice(0,-6);
          props.push(prop);
          x += temp;
          x += "'";
          values.push(x);
        }
        else if(obj.results[prop] === null){
          props.push(prop);
          values.push('null');
        }
        else {
        props.push(prop);
        x += obj.results[prop];
        x += "'";
        values.push(x);
        }

    }

    //console.log(props, values);

    if(incr === 1 ){

      console.log('inserting');

      pg.connect(connectionString, function(err, client, done){

        var query = client.query("DELETE FROM sundata *", function(error, result){
          if(error){res.send(error);}
        })

        query.on('end', function(response){

          pg.connect(connectionString, function(err, client, done){

            var query = client.query("INSERT INTO sundata ("+ props.toString()+") values("+values.toString()+")", function(error, result){
              if(error){res.send(error);}
            })
          })

        })
      })


    }
    else {
      console.log('updating');
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
  http.get(HTTPoptions.sun_data, sunData_cb).end();

}

var outer = setTimeout(function(){
  console.log('refreshing sundata on load: ', new Date());
  http.get(HTTPoptions.sun_data, sunData_cb).end();

  var inner = setTimeout(function(){
    http.get(HTTPoptions.sun_data, sunData_cb).end();
    console.log('refreshing sundata after initial delay: ', new Date());
    setInterval(refreshSunData, 86400000);
    clearTimeout(inner);

  }, delay);

  clearTimeout(outer);
});

var profileTimer = setTimeout(function(){
  runActiveProfiles();

  var x = setTimeout(function(){
    runActiveProfiles();
    setInterval(runActiveProfiles, 86400000);
    clearTimeout(x);
  }, delay);
  clearTimeout(profileTimer);
}, 5000);

function runActiveProfiles(){
  console.log('running active profiles', new Date());

  var obj = {};
  var activeProfiles = {};
  var i;

  http.get(HTTPoptions.get_profiles, function(response){

    response.on('data', function(data){

      JSON.parse(data).forEach(function(elem, ind, arr){
        http.get({
          port: process.env.PORT || '3000',
          path: '/profiles/' + elem.profile.profile_name
        }, function(response){
          response.on('data',function(data){
            activeProfiles[elem.profile.profile_name] = JSON.parse(data);

          });
          response.on('end', function(){

            for(var prop in activeProfiles){

              for(i = 0 ; i < activeProfiles[prop].length ; i ++){
                var date;

                if(activeProfiles[prop][i].set === true || activeProfiles[prop][i].rise === true) {
                  if (activeProfiles[prop][i].set === true) {
                    date = Date.parse(new Date(activeProfiles[prop][i].sunset));
                    date += i * 1000;
                  }
                  if (activeProfiles[prop][i].rise === true) {
                    date = Date.parse(new Date(activeProfiles[prop][i].sunrise));
                    date += i * 1000;
                  }

                }
                var postData = JSON.stringify(activeProfiles[prop][i]);

                var req = http.request(HTTPoptions.run_profiles, function(res){
                  console.log('STATUS: ${res.statusCode}');
                  res.on('data',function(chunk){
                    //console.log('BODY: ${chunk}');
                  });
                  res.on('end', function(chunk){
                    //console.log('this is the response: ', chunk);
                  })
                });

                req.on('error', function(e){
                  console.log('problem with request: ${e.message}');
                });

                //console.log('HER ER JEG: ', activeProfiles);

                req.write(postData);
                req.end();

                //}
              }
            }

          })
        })
      });

    });

  });
}

module.exports = app;
