var express = require('express'),
    router = express.Router();
var pg = require('pg');
var child = require('child_process');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/', function(req, res, error){

    var options = {
        maxBuffer: 10*1024,
        killSignal: 'SIGTERM'

    };

    child.exec('hcitool lescan', options, function(err, stdout, stderr){
        if(err) {
            console.log('an error occurred: ', stderr)
        }
        console.log(stdout);
    })
});

router.post('/', function(req, res, error){

});

router.delete('/', function(req, res, error){

});

module.exports = router;