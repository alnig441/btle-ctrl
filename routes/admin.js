var express = require('express'),
    router = express.Router();
var pg = require('pg');
//var child = require('child_process');
var spawn = require('child_process').spawn;
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/', function(req, res, error){

    var options = {
        timeout: 500,
        killSignal: 'SIGTERM'

    };

    var child = spawn('sudo hcitool lescan');

    child.stdout.on('data', function(data){
        console.log('child process output: ', data.toString());
    });

    child.stderr.on('data', function(data){
        console.log('child process error: ', data.toString());
    });

    child.on('close', function(code){
        console.log('child process closed with: ', code);
    })

    //child.exec('sudo hcitool lescan', options, function(err, stdout, stderr){
    //    if(err) {
    //        console.log('an error occurred: ', stderr)
    //    }
    //    console.log(stdout);
    //});


});

router.post('/', function(req, res, error){

});

router.delete('/', function(req, res, error){

});

module.exports = router;