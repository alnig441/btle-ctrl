var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/', function(req, res, error){

    var arr = [];

    console.log('..scanning..');

    var child = spawn('sudo', ['hcitool', 'lescan']);

    child.stdout.on('data', function(data){
        arr = data.toString().split(/\n/);
        child.kill();
    });

    child.on('exit', function(code){
        console.log('spawned process ended on exit code: ', code);
    });

    console.log('this is from hcitool: ', arr);

});


router.post('/', function(req, res, error){

});

router.delete('/', function(req, res, error){

});

module.exports = router;