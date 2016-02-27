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
    var setpoint;
    var gattArgs;

    if(req.body.turnOff || req.body.offAtSunrise) {
        gattArgs = call.buildGattargs(req.body.mac, off);
    }
    if(req.body.turnOn || req.body.onAtSunset) {
        gattArgs = call.buildGattargs(req.body.mac, on);
    }

    //RECURRING SCHEDULE - REGULAR CONTROL
    if(req.body.recurWeekly || req.body.recurDaily || req.body.dateEnd !== undefined){

        var begin = new Date(req.body.dateBegin);
        begin.setHours(parseInt(req.body.hour));
        begin.setMinutes(parseInt(req.body.minute));

        //if(begin < new Date()){
        //
        //}

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

        //RECURRING SCHEDULE - REGULAR CONTROL
        console.log('setting up recurring schedule - regular control', recur, req.body);

        req.body.turnOn ? req.body.device_on = true : req.body.device_on = false;

        var job = schedule.scheduleJob('Recur/regular '+ req.body.location, recur, function(){

            var child = spawn('gatttool', gattArgs);

            child.stdout.on('data', function(data){

                res.send(data);

                child.kill();
            });

            child.on('exit', function(code){
                console.log('spawned process ended on exit code: ', code);

                if(code === 0){
                    console.log('gatttool run success');

                }
                else {
                    console.log('check hciconfig');
                }

            });

        });

        job.on('scheduled', function(date){
            console.log('job schedule success', date);

        });

        job.on('run', function(){
            console.log('job ran');

            pg.connect(connectionString, function (err, client, done) {

                var query = client.query("UPDATE devices SET device_on='" + req.body.device_on + "' where mac='" + req.body.mac + "'", function (error, result) {
                    if (error) {
                        console.log('there was an error ', error);
                    }
                })

                query.on('end', function (result) {
                    client.end();
                    //res.send(result);
                })

            });


        });

    }

    //NON-RECURRING SCHEDULE - REGULAR CONTROL
    else {

        req.body.turnOn ? req.body.device_on = true : req.body.device_on = false;

        setpoint = new Date(req.body.dateBegin);
        setpoint.setHours(parseInt(req.body.hour));
        setpoint.setMinutes(parseInt(req.body.minute));
        setpoint.setSeconds(0);

        console.log('scheduling regular non-recurring control', setpoint);

        var job = schedule.scheduleJob('regular non-recur ' + req.body.location + ' ' + setpoint, setpoint, function () {

            var child = spawn('gatttool', gattArgs);

            child.stdout.on('data', function (data) {

                res.send(data);
                child.kill();
            });

            child.on('exit', function (code) {
                console.log('spawned process ended on exit code: ', code);
                if (code === 0) {
                    console.log('gatttool run success');
                }
                else {
                    console.log('check hciconfig');
                }

            });

        });

        job.on('scheduled', function (date) {
            console.log('job scheduled', date);
        });

        job.on('run', function () {
            console.log('my job ran');

            pg.connect(connectionString, function (err, client, done) {

                //console.log('regular - non recurring ', req.body);

                var query = client.query("UPDATE devices SET device_on='" + req.body.device_on + "' where mac='" + req.body.mac + "'", function (error, result) {
                    if (error) {
                        console.log('there was an error ', error);
                    }
                })

                query.on('end', function (result) {
                    client.end();
                    res.send(result);
                })

            });

        });

    }

    var items = schedule.scheduledJobs;
    console.log('scheduled jobs: ', Object.keys(items));
    res.send(items);


});

router.post('/sun', function(req, res, error){

    console.log('options/sun ', req.body);

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var setpoint;
    var gattArgs;
    var c;

    if((new Date(req.body.sunset) < new Date() && req.body.onAtSunset ) || (new Date(req.body.sunrise) < new Date() && req.body.offAtSunrise)){
        res.send('invalid request');
    }

    else {

        if(req.body.offAtSunrise) {
            gattArgs = call.buildGattargs(req.body.mac, off);
        }
        if(req.body.onAtSunset) {
            gattArgs = call.buildGattargs(req.body.mac, on);
        }

        req.body.onAtSunset ? (setpoint = new Date(req.body.sunset)) : (setpoint = new Date (req.body.sunrise));
        req.body.onAtSunset ? req.body.device_on = true : req.body.device_on = false;

        console.log('schedulling non-recurring sunrise/sunset control in options/sun', setpoint);

        var job = schedule.scheduleJob('sunrise/sunset non-recur '+ req.body.location + ' ' + setpoint, setpoint, function(){

            //do {
                var child = spawn('gatttool', gattArgs);

                child.stdout.on('data', function(data){

                    res.send(data);

                    child.kill();
                });

                child.on('exit', function (code) {
                    console.log('spawned process ended on exit code: ', code);
                    if (code === 0) {
                        c = code;
                        console.log('gatttool run success');

                    }
                    else {
                        console.log('check hciconfig');
                    }

                });

            //} while (c !== 0);

        });

        job.on('scheduled',function(date){
            console.log('job scheduled', date);
        });

        job.on('run', function(){
            console.log('my job ran');

            pg.connect(connectionString, function (err, client, done) {

                var query = client.query("UPDATE devices SET device_on='" + req.body.device_on + "' where mac='" + req.body.mac + "'", function (error, result) {
                    if (error) {
                        console.log('there was an error ', error);
                    }
                })

                query.on('end', function (result) {
                    client.end();
                })
                //res.status(200);

            });

        });
        ////var x = schedeule.scheduledJobs;
        //console.log('scheduled jobs: ');
    }

    var items = schedule.scheduledJobs;
    console.log('scheduled jobs: ', Object.keys(items));
    res.send(items);


});

router.post('/profile_recur', function(req, res, error){

    //PROFILE DRIVEN RECURRING SCHEDULE

    console.log('in profile_recur ', req.body);

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var arg;
    var setpoint;
    var gattArgs;
    var device_on;
    var c;


    if(new Date() > req.body.sunrise || new Date() > req.body.sunset){
        res.send('invalid request');
    }

    else {

        if(req.body.on_at_sunset){
            arg = on;
            setpoint = new Date(req.body.sunset);
            device_on = true;
        }

        if(req.body.off_at_sunrise){
            arg = off;
            setpoint = new Date(req.body.sunrise);
            device_on = false;
        }

        gattArgs = call.buildGattargs(req.body.mac, arg);

        var job = schedule.scheduleJob('sunrise/sunset recur ' + req.body.location + ' ' + setpoint, setpoint, function(){

            //do {

                var child = spawn('gatttool', gattArgs);

                child.stdout.on('data', function(data){

                    res.send(data);

                    child.kill();
                });

                child.on('exit', function (code) {
                    console.log('spawned process ended on exit code: ', code);
                    if (code === 0) {
                        c = code;
                        console.log('gatttool run success');

                    }
                    else {
                        console.log('check hciconfig');
                    }

                });

            //} while (c !== 0);


        });

        job.on('run', function(){
            console.log('my job ran');

            pg.connect(connectionString, function (err, client, done) {

                var query = client.query("UPDATE devices SET device_on='" + device_on + "' where mac='" + req.body.mac + "'", function (error, result) {
                    if (error) {
                        console.log('there was an error ', error);
                    }
                })

                query.on('end', function (result) {
                    client.end();
                })

            });


        });

    }

    var items = schedule.scheduledJobs;
    console.log('scheduled jobs: ', Object.keys(items));
    res.send(items);


});

router.post('/colour', function(req, res, error){

    var colour = '58010301ff00';

    for(var i in req.body.colour){
        if(req.body.colour[i] < 16){
            colour += '0';
        }
        colour += ayb.decToHex(req.body.colour[i]);
    }

    var gattArgs = call.buildGattargs(req.body.mac, colour);

    var child = spawn('gatttool', gattArgs);

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