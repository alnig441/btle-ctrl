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

    var on = '58010301ff00ffffff',
        off = '58010301ff00000000';
    var setpoint;
    var gattArgs;

    req.body.sunset ? setpoint = req.body.sunset : req.body.sunrise;
    req.body.sunset ? gattArgs = call.buildGattargs(req.body.mac, on) : gattArgs = call.buildGattargs(req.body.mac, off);

    var job = CronJob(new Date(), function(){

        //var child = spawn('gatttool', gattArgs);
        //
        //child.stdout.on('data', function(data){
        //
        //    res.send(data);
        //
        //    child.kill();
        //});


    })
    job.start();

});


module.exports = router;