var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.js');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/test', function(req, res, error){

    console.log(call.cleanArray(x));

});

router.get('/reset', function(req, res, error){

    console.log('...resetting...');

    var child = spawn('sudo', ['hciconfig', '-a', 'hci1', 'reset']);

    child.on('exit', function(code){
        res.send('child process exit code: ', code);
    });
});

router.get('/scan', function(req, res, error){

    /*FOR TESTING ONLY*/
    //var test = [
    //    'LE Scan',
    //    'B4:99:4C:64:80:B4 (unknown)',
    //    'B4:99:4C:64:80:B4 RGBLightOne',
    //    'B4:99:4C:64:80:B4 (unknown)',
    //    'B4:99:4C:64:80:B4 RGBLightOne',
    //    'B4:99:4C:64:80:B4 (unknown)',
    //    'B4:99:4C:59:67:C4 (unknown)',
    //    'B4:99:4C:59:67:C4 RGBLightOne',
    //    'B4:99:4C:59:67:C4 (unknown)',
    //    'B4:99:4C:59:67:C4 RGBLightOne'
    //    ];

    var arr = [];

    console.log('..scanning..');

    /*FOR TESTING ONLY*/
    //arr = test.toString().split(/\n/);
    //res.send(call.cleanArray(arr));


    var child = spawn('sudo', ['hcitool', 'lescan']);

    child.stdout.on('data', function(data){
        arr = data.toString().split(/\n/);

        res.send(call.cleanArray(arr));

        child.kill();
    });

    child.on('exit', function(code){
        console.log('spawned process ended on exit code: ', code);
    });

});


router.post('/', function(req, res, error){

});

router.delete('/', function(req, res, error){

});

module.exports = router;