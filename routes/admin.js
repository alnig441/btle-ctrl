var express = require('express'),
    router = express.Router();
var pg = require('pg');
var child = require('child_process');
var spawn = require('child_process').spawn;
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/spawn', function(req, res, error){

    console.log('scanning...');
    var arr = [];

    var options = {
        timeout: 500,
        killSignal: 'SIGTERM'

    };

    var scan = spawn('sudo hcitool lescan');

    scan.stdout.on('data', function(data){
        console.log('child process output: ', data.toString());
        arr = data.toString().split(/\n/);
        console.log('printing array: ', arr);
    });

    scan.stderr.on('data', function(data){
        console.log('child process error: ', data.toString());
    });

    scan.on('close', function(code){
        console.log('child process closed with: ', code);
        console.log('array on close: ', arr);
    });


});

router.get('/exec', function(req, res, error){

    console.log("exec'ing...");
    child.exec('sudo hcitool lescan', options, function(err, stdout, stderr){
        if(err) {
            console.log('an error occurred: ', stderr)
        }
        console.log(stdout);
    });

});

router.post('/', function(req, res, error){

});

router.delete('/', function(req, res, error){

});

module.exports = router;