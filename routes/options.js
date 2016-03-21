var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var call = require('../public/scripts/myFunctions.min.js');
var schedule = require('node-schedule');
var ayb = require('all-your-base');
var http = require('http');


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.post('/schedule', function(req, res, error){

    console.log('options/schedule; ', req.body);

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var setpoint = new Date(req.body.setpoint);
    var gattArgs;
    var begin;
    var flip;

    //req.body.turn_on ? gattArgs = call.buildGattargs(req.body.mac, on) : gattArgs = call.buildGattargs(req.body.mac, off);
    if(req.body.turn_on){
        gattArgs = call.buildGattargs(req.body.mac, on);
        flip = 'ON';
    } else {
        gattArgs = call.buildGattargs(req.body.mac, off);
        flip ='OFF';
    }
    req.body.dateEnd !==undefined ? begin = new Date(req.body.dateBegin) : begin = new Date(req.body.today);

    begin.setHours(setpoint.getHours());
    begin.setMinutes(setpoint.getMinutes());
    begin.setSeconds(setpoint.getSeconds());

    //RECURRING SCHEDULE - REGULAR CONTROL
    if(req.body.recur_weekly || req.body.recur_daily || req.body.dateEnd !== undefined){


        var recur = new schedule.RecurrenceRule();
        recur.hour = begin.getHours();
        recur.minute = begin.getMinutes();

        if(req.body.recur_weekly){
            recur.dayOfWeek = begin.getDay();
        }
        if(req.body.dateEnd !== undefined){
            var end = new Date(req.body.dateEnd);
            recur.dayOfWeek = new schedule.Range(begin.getDay(), end.getDay());
        }

        //RECURRING SCHEDULE - REGULAR CONTROL
        console.log('setting up recurring schedule - regular control', recur, req.body);

        var job = schedule.scheduleJob('RECUR ID_'+ Date.parse(begin) + ' '+ req.body.location + ' '+ flip +' @ ' + recur.hour + ':'+ recur.minute, recur, function(){

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

        }, function(){
            job.cancel();
        });

        job.on('scheduled', function(date){
            console.log('job schedule success', date);

        });

        job.on('run', function(){
            console.log('job ran');

            pg.connect(connectionString, function (err, client, done) {

                var query = client.query("UPDATE devices SET device_on='" + req.body.turn_on + "' where mac='" + req.body.mac + "'", function (error, result) {
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

    //NON-RECURRING SCHEDULE - REGULAR CONTROL
    else {

        if(new Date() > begin){
            console.log('Bad request: regular non-recur');

        }

        else {

            //console.log('scheduling regular non-recurring control', begin);

            var job = schedule.scheduleJob('ID_' + Date.parse(begin) + ': ' + req.body.location +' '+ flip + ' @ ' + begin.getHours() + ':' + begin.getMinutes(), begin, function () {

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

            }, function(){
                job.cancel();
            });

            job.on('scheduled', function (date) {
                console.log('job scheduled', date);
            });

            job.on('run', function () {
                console.log('my job ran');

                pg.connect(connectionString, function (err, client, done) {

                    var query = client.query("UPDATE devices SET device_on='" + req.body.turn_on + "' where mac='" + req.body.mac + "'", function (error, result) {
                        if (error) {
                            console.log('there was an error ', error);
                        }
                    })

                    query.on('end', function (result) {
                        client.end();
                    })

                });

            });

            var items = schedule.scheduledJobs;
            //console.log('scheduled jobs: ', Object.keys(items));
            res.send(items);

        }


    }


});

router.post('/sun', function(req, res, error){

    console.log('options/sun ', req.body);

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var setpoint;
    var gattArgs;
    var sun;
    var flip;

    if((new Date(req.body.sunset) < new Date() && req.body.onAtSunset ) || (new Date(req.body.sunrise) < new Date() && req.body.offAtSunrise)){
        res.send('invalid request');
    }

    else {

        if(req.body.offAtSunrise) {
            gattArgs = call.buildGattargs(req.body.mac, off);
            sun = 'Sunrise'
            flip = 'OFF';
        }
        if(req.body.onAtSunset) {
            gattArgs = call.buildGattargs(req.body.mac, on);
            sun = 'Sunset';
            flip = 'ON';
        }

        req.body.onAtSunset ? (setpoint = new Date(req.body.sunset)) : (setpoint = new Date (req.body.sunrise));
        req.body.onAtSunset ? req.body.device_on = true : req.body.device_on = false;

        console.log('schedulling non-recurring sunrise/sunset control in options/sun', setpoint);

        var job = schedule.scheduleJob('ID_'+ Date.parse(setpoint) +': '+ req.body.location + ' '+ flip + ' @ ' + sun, setpoint, function(){

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


        }, function(){
            job.cancel();
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

            });

        });
    }

    var items = schedule.scheduledJobs;
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

router.post('/profile', function(req, res, error){

    var obj;
    for(var prop in req.body){
        obj = JSON.parse(prop);
    }

    req.body = obj;

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var arg;
    var setpoint;
    var gattArgs;

    req.body.turn_on ? arg = on : arg = off;
    gattArgs = call.buildGattargs(req.body.id, arg);

    //SUN RELATED DATA

    if(req.body.set === true || req.body.rise === true){

        if(req.body.set === true && new Date() > new Date(req.body.sunset)){

            res.status(200).send('invalid date');

        }

        else if(req.body.rise === true && new Date() > new Date(req.body.sunrise)){

            res.status(200).send('invalid date');
        }

        else{

            //req.body.set ? setpoint = new Date(req.body.sunset) : setpoint = new Date(req.body.sunrise);
            setpoint = new Date(req.body.setpoint);

            var job = schedule.scheduleJob('PROFILE: ' + req.body.profile_name +'   ID_' + req.body.id + '_' + Date.parse(setpoint), setpoint, function(){


                var child = spawn('gatttool', gattArgs);

                child.stdout.on('data', function(data){

                    res.send(data);

                    child.kill();
                });

                child.on('exit', function (code) {
                    console.log('spawned process ended on exit code: ', code);
                    if (code === 0) {
                        console.log('gatttool run success');

                        pg.connect(connectionString, function (err, client, done) {

                            var query = client.query("UPDATE devices SET device_on='" + req.body.turn_on + "' where mac='" + req.body.id + "'", function (error, result) {
                                if (error) {
                                    console.log('there was an error ', error);
                                }
                            })

                            query.on('end', function (result) {
                                client.end();
                            })

                        });


                    }
                    else {
                        console.log('check hciconfig');
                    }

                });


            }, function(){
                job.cancel();
            });

            job.on('run', function(){
                console.log('my '+req.body.profile_name+' job ran');

            });

            var items = schedule.scheduledJobs;
            //console.log('scheduled jobs: ', Object.keys(items));
            res.send(items);


        }

    }

    //SUN RELATED DATA END

    else{
        setpoint = new Date(req.body.setpoint);
        //console.log('options/profile - setpoint: ', setpoint);


        if(new Date() > setpoint){
            res.status(200).send('invalid date');
        }

        else{
            var job = schedule.scheduleJob('PROFILE: ' + req.body.profile_name +'   ID_' + req.body.id + '_' + Date.parse(setpoint), setpoint, function(){


                var child = spawn('gatttool', gattArgs);

                child.stdout.on('data', function(data){

                    res.send(data);

                    child.kill();
                });

                child.on('exit', function (code) {
                    console.log('spawned process ended on exit code: ', code);
                    if (code === 0) {
                        console.log('gatttool run success');

                        pg.connect(connectionString, function (err, client, done) {

                            var query = client.query("UPDATE devices SET device_on='" + req.body.turn_on + "' where mac='" + req.body.id + "'", function (error, result) {
                                if (error) {
                                    console.log('there was an error ', error);
                                }
                            })

                            query.on('end', function (result) {
                                client.end();
                            })

                        });


                    }
                    else {
                        console.log('check hciconfig');
                    }

                });


            }, function(){
                job.cancel();
            });

            job.on('run', function(){
                console.log('my '+req.body.profile_name+' job ran');

            });

            var items = schedule.scheduledJobs;
            //console.log('scheduled jobs: ', Object.keys(items));
            res.send(items);


        }

    }

});


module.exports = router;