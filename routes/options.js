var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');
var schedule = require('node-schedule');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.get('/', function(req, res, error){

    console.log('in options router');

   var test = schedule.scheduleJob('15 * * * *', function(){
       console.log('Testing Scheduler!');
   });

});

module.exports = router;