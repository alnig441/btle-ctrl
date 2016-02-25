var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var call = require('../public/scripts/myFunctions.min.js');
var ayb = require('all-your-base');
var CronJob = require('cron').CronJob;

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.post('/', function(req, res, error) {

    console.log('in cronjobs router', req.body.devices);

    var on = '58010301ff00ffffff',
        off = '58010301ff00000000';
    var setpoint;
    //var gattArgs;

    var test = new Date();
    //test.setMinutes(test.getMinutes()+5);

    //req.body.sunset ? setpoint = req.body.sunset : req.body.sunrise;
    //req.body.sunset ? gattArgs = call.buildGattargs(req.body.mac, on) : gattArgs = call.buildGattargs(req.body.mac, off);

    var job = CronJob({
        cronTime : new Date(),
        onTick: function(){
            for(var i = 0 ; i < req.body.devices.length ; i ++){
                console.log(req.body.devices[i]);
            }
        },

    })

    console.log(job);


});


module.exports = router;