var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/reset', function(req, res, error){

    console.log('...resetting...');

    var child = spawn('sudo', ['hciconfig', '-a', 'hci1', 'reset']);

    child.on('exit', function(code){
        res.send('child process exit code: ', code);
    })
});

router.get('/scan', function(req, res, error){

    var arr = [];

    console.log('..scanning..');

    var reset = spawn('sudo', ['hciconfig', '-a','hci1', 'reset']);
    var child = spawn('sudo', ['hcitool', 'lescan']);

    child.stdout.on('data', function(data){
        arr = data.toString().split(/\n/);
        res.send(arr);
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