var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var call = require('../public/scripts/myFunctions.min.js');
var schedule = require('node-schedule');
var ayb = require('all-your-base');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.post('/schedule', function(req, res, error){

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

    if(req.body.turnOff || req.body.offAtSunrise) {
        flipSwitch.gattArgs.push(off);
    }
    if(req.body.turnOn || req.body.onAtSunset) {
        flipSwitch.gattArgs.push(on);
    }

    //RECURRING SCHEDULE
    if(req.body.recurWeekly || req.body.recurDaily || req.body.dateEnd !== undefined){

        var begin = new Date(req.body.dateBegin);

        var recur = new schedule.RecurrenceRule();
        recur.hour = parseInt(req.body.hour);
        recur.minute = parseInt(req.body.minute);

        if(req.body.recurWeekly){
            recur.dayOfWeek = begin.getDay();
        }
        if(req.body.dateEnd !== undefined){
            var end = new Date(req.body.dateEnd);
            recur.dayOfWeek = new schedule.Range(begin.getDay(), end.getDay());
        }

        //RECURRING - REGULAR CONTROL
        console.log('setting up recurring schedule - regular control', recur);

        req.body.turnOn ? req.body.device_on = true : req.body.device_on = false;

        var job = schedule.scheduleJob(recur, function(){

            var child = spawn('gatttool', flipSwitch.gattArgs);

            child.stdout.on('data', function(data){

                res.send(data);

                child.kill();
            });

            child.on('exit', function(code){
                console.log('spawned process ended on exit code: ', code);
            });

        });

        job.on('scheduled', function(date){
            console.log('job schedule success', date);

        });

        job.on('run', function(){
            console.log('job ran');

            pg.connect(connectionString, function(err, client, done){

                var query = client.query("UPDATE devices SET device_on='"+ req.body.device_on +"' where mac='" + req.body.mac + "'", function(error, result){
                    if(error){console.log('there was an error ', error.detail);}
                })

                query.on('end',function(result){
                    client.end();
                    //res.send(result);
                })

            });

        });

        res.sendStatus(200);

    }

    // NON-RECURRING SCHEDULE - SUNSET/SUNRICE CONTROL
    else if(req.body.offAtSunrise || req.body.onAtSunset) {

        req.body.onAtSunset ? (setpoint = new Date(req.body.sunset)) : (setpoint = new Date (req.body.sunrise));
        req.body.onAtSunset ? req.body.device_on = true : req.body.device_on = false;

        console.log('schedulling non-recurring sunrise/sunset control', setpoint);

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

        job.on('scheduled',function(date){
            console.log('job scheduled', date);
        });

        job.on('run', function(){
            console.log('my job ran');

            pg.connect(connectionString, function(err, client, done){

                var query = client.query("UPDATE devices SET device_on='"+ req.body.device_on +"' where mac='" + req.body.mac + "'", function(error, result){
                    if(error){console.log('there was an error ', error.detail);}
                })

                query.on('end',function(result){
                    client.end();
                    //res.send(result);
                })

            });
        });

        res.sendStatus(200);


    }

    //NON-RECURRING SCHEDULE - REGULAR CONTROL
    else {

        req.body.turnOn ? req.body.device_on = true : req.body.device_on = false;

        setpoint = new Date(req.body.dateBegin);
        setpoint.setHours(parseInt(req.body.hour));
        setpoint.setMinutes(parseInt(req.body.minute));
        setpoint.setSeconds(0);

        console.log('scheduling regular non-recurring control', setpoint);

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

        job.on('scheduled',function(date){
            console.log('job scheduled', date);
        });

        job.on('run', function(){
            console.log('my job ran');

            pg.connect(connectionString, function(err, client, done){

                var query = client.query("UPDATE devices SET device_on='"+ req.body.device_on +"' where mac='" + req.body.mac + "'", function(error, result){
                    if(error){console.log('there was an error ', error.detail);}
                })

                query.on('end',function(result){
                    client.end();
                    //res.send(result);
                })

            });

        });

        res.sendStatus(200);

    }

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