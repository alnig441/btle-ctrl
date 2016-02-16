var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var call = require('../public/scripts/myFunctions.min.js');
var schedule = require('node-schedule');
var ayb = require('all-your-base');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.post('/schedule', function(req, res, error){

    //console.log('in options/schedule', req.body);

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var sunrise = new Date(req.body.sunrise);
    var sunset = new Date(req.body.sunset);
    var setpoint;

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

    if(req.body.recurWeekly || req.body.recurDaily){

        if(req.body.onAtSunset || req.body.offAtSunrise){

        }

        else{
        //    write code for ordinary recurring schedule

        }
    }

    if(req.body.offAtSunrise || req.body.onAtSunset) {

        console.log('schedulling non-recurring sunrise/sunset control');

        if(req.body.offAtSunrise){
            flipSwitch.gattArgs.push(off);
            setpoint = new Date(req.body.sunrise);
        }
        else {
            flipSwitch.gattArgs.push(on);
            setpoint = new Date(req.body.sunset);
        }

        var job = schedule.scheduleJob(setpoint, function(){

            var child = spawn('gatttool', flipSwitch.gattArgs);

            child.stdout.on('data', function(data){

                res.send(data);

                child.kill();
            });

            child.on('exit', function(code){
                console.log('spawned process ended on exit code: ', code);
            });

        });

        job.on('scheduled',function(arg){
            console.log('job scheduled', arg);
        });

        job.on('run', function(arg){
            console.log('my job ran');
        });


    }

    else {

        console.log('scheduling regular non-recurring control: ', flipSwitch.gattArgs, setpoint);

        setpoint = new Date();
        setpoint.setHours(parseInt(req.body.hour));
        setpoint.setMinutes(parseInt(req.body.minute));
        setpoint.setSeconds(0);

        if(req.body.turnOn){
            flipSwitch.gattArgs.push(on);
        }
        else if(req.body.turnOff) {
            flipSwitch.gattArgs.push(off);
        }


        var job = schedule.scheduleJob(setpoint, function(){

            var child = spawn('gatttool', flipSwitch.gattArgs);

            child.stdout.on('data', function(data){

                res.send(data);

                child.kill();
            });

            child.on('exit', function(code){
                console.log('spawned process ended on exit code: ', code);
            });

        });

        job.on('scheduled',function(arg){
            console.log('job scheduled', arg);
        });

        job.on('run', function(arg){
            console.log('my job ran');
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