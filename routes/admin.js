var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/test', function(req, res, error){

    console.log('this is from test');

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
    var test = [
        'LE Scan',
        'B4:99:4C:64:80:B4 (unknown)',
        'B4:99:4C:64:80:B4 RGBLightOne',
        'B4:99:4C:64:80:B4 (unknown)',
        'B4:99:4C:64:80:B4 RGBLightOne',
        'B4:99:4C:64:80:B4 (unknown)',
        'B4:99:4C:59:67:C4 (unknown)',
        'B4:99:4C:59:67:C4 RGBLightOne',
        'B4:99:4C:59:67:C4 (unknown)',
        'B4:99:4C:59:67:C4 RGBLightOne'
        ];

    var arr = [];

    console.log('..scanning..');

    /*FOR TESTING ONLY*/
    arr = test.toString().split(/\n/);
    res.send(call.cleanArray(arr));


    //var child = spawn('sudo', ['hcitool', 'lescan']);
    //
    //child.stdout.on('data', function(data){
    //    arr = data.toString().split(/\n/);
    //
    //    res.send(call.cleanArray(arr));
    //
    //    child.kill();
    //});
    //
    //child.on('exit', function(code){
    //    console.log('spawned process ended on exit code: ', code);
    //});

});


router.post('/', function(req, res, error){

    console.log('from admin post: ', req.body.location);

    pg.connect(connectionString, function(err, client, done){
        if(err){console.log(err);}

        var query = client.query("INSERT INTO devices(mac, location, device_on) values($1, $2, $3)", [req.body.mac, req.body.location, true], function(error, result){
            if(error){console.log(error.detail);}
        });

        query.on('end', function(result){
            client.end();
            res.send('device ' + req.body.mac + ' created');

        });
    })


});

router.delete('/:mac?', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){
        if(err){console.log(err);}

        var query = client.query("DELETE FROM devices WHERE mac='" + req.params.mac + "'", function(error, result){
            if(error){console.log('there was an error ', error.detail);}
        })

        query.on('end', function(result){
            client.end();
            res.send('user '+ req.params.mac + ' deleted');
        })
    })

});

module.exports = router;