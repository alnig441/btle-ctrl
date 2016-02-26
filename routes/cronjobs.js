var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var call = require('../public/scripts/myFunctions.min.js');
var ayb = require('all-your-base');
var CronJob = require('cron').CronJob;

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.post('/', function(req, res, error) {

    console.log('in cronjobs router', req.body);

    gattArgs = [
        '-i',
        'hci1',
        '-b',
        req.body.mac,
        '--char-write',
        '-a',
        '0x0028',
        '-n',
        '58010301ff00ffffff'
    ];
    //
    //var on = '58010301ff00ffffff',
    //    off = '58010301ff00000000';
    var setpoint = new Date();
    setpoint.setMinutes(setpoint.getMinutes()+5);

    console.log('time now: ' + new Date() + '. Time scheduled: ' + setpoint);
    ////var gattArgs;
    //
    //var test = new Date();
    ////test.setMinutes(test.getMinutes()+5);
    //
    ////req.body.sunset ? setpoint = req.body.sunset : req.body.sunrise;
    ////req.body.sunset ? gattArgs = call.buildGattargs(req.body.mac, on) : gattArgs = call.buildGattargs(req.body.mac, off);
    //
    var job = new CronJob(setpoint, function() {
            /* runs once at the specified date. */
            console.log('printing this at '+ new Date() + '. Scheduled to run at: ' + setpoint);

            var child = spawn('gatttool', gattArgs);

            child.stdout.on('data', function(data){

                res.send(data);

                child.kill();
            });

            //child.on('exit', function (code) {
            //    console.log('spawned process ended on exit code: ', code);
            //    if (code === 0) {
            //        console.log('gatttool run success');
            //
            //    }
            //    else {
            //        console.log('check hciconfig');
            //    }
            //
            //});


        }, function () {
            /* This function is executed when the job stops */
            console.log('cronjob schedule and run success');
        },
        true /* Start the job right now */
    );
    console.log(job);

    res.status(200);


});


module.exports = router;