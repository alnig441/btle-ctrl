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

router.post('/schedule', function(req, res, error){

    var sunrise = new Date(req.body.sunrise);
    var sunset = new Date(req.body.sunset);

    var flipSwitch = {
        gattArgs: [
            '-i',
            'hci1',
            '-b',
            req.body.mac,
            '--char-write',
            '-a',
            '0x0028',
            '-n'
        ]
    };


    console.log('TADA!!', sunset.getMonth()-1, typeof sunset.getMonth());


    if((req.body.offAtSunrise || req.body.onAtSunset) && req.body.recurDaily) {
        console.log('its a hit!!');
    //write code to reschedule device acitivity every day at sunset or sunrise
    }

    if(req.body.onAtSunset) {

        flipSwitch.gattArgs.push('58010301ff00ffffff');

        console.log('on at sunset ', flipSwitch.gattArgs);

        var job = schedule.scheduleJob(sunrise.getFullYear(), sunrise.getMonth()-1, sunrise.getDate(), sunrise.getHours(), sunrise.getMinutes(), sunrise.getSeconds(), function(){

            //var child = spawn('gatttool', flipSwitch.gattArgs);
            //
            //child.stdout.on('data', function(data){
            //
            //    res.send(data);
            //
            //    child.kill();
            //});
            //
            //child.on('exit', function(code){
            //    console.log('spawned process ended on exit code: ', code);
            //});

            console.log('the sun has set in Edina at ', sunset);

        });

        job.on('scheduled',function(arg){
            console.log('job scheduled', arg);
        });

        job.on('run', function(arg){
            console.log('my job ran', arg);
        });


    }


    res.sendStatus(200);

});

router.post('/colour', function(req, res, error){

    console.log('in optiona colour route ', req.body);

    var chgColour = {
        gattArgs: [
            '-i',
            'hci1',
            '-b',
            req.body.mac,
            '--char-write',
            '-a',
            '0x0028',
            '-n'
        ]
    };


    var hex = '58010301ff00';

    for(var i in req.body.colour){
        if(req.body.colour[i] < 16){
            hex += '0';
        }
        hex += ayb.decToHex(req.body.colour[i]);
    }

    chgColour.gattArgs.push(hex);
    console.log(chgColour.gattArgs);

    var child = spawn('gatttool', chgColour.gattArgs);

    child.stdout.on('data', function(data){

        res.send(data);

        child.kill();
    });

    child.on('exit', function(code){
        console.log('spawned process ended on exit code: ', code);
    });



    res.sendStatus(200);

});

module.exports = router;