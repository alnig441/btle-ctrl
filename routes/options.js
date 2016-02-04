var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var call = require('../public/scripts/myFunctions.min.js');
var schedule = require('node-schedule');
var ayb = require('all-your-base');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.get('/', function(req, res, error){

    console.log('in options router');

    var rule = new schedule.RecurrenceRule();
    rule.second = 15;

    var j = schedule.scheduleJob(rule, function(){
        var date = new Date();
        console.log('My arse is pining for a chocolate whip!', new Date());
    });
    var x = j.pendingInvocations();

    j.on('scheduled',function(arg){
        console.log('job scheduled', arg);
    });

    j.on('run', function(arg){
        console.log('my job ran', arg);
    });

});

router.post('/sun', function(req, res, error){

    console.log('in options route sun ', req.body);
    res.sendStatus(200);

});

router.post('/colour', function(req, res, error){

    console.log('in optiona colour route ', req.body);

    var hex = '#';

    for(var colour in req.body){
        hex += ayb.decToHex(req.body[colour]);
    }



    res.sendStatus(200);

});

module.exports = router;