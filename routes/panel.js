var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';


router.get('/', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var device = [];
        var query = client.query("SELECT * FROM devices ORDER BY location", function(error, result){
            if(error){console.log('there was an error ', error.detail);}
        })

        query.on('row', function(row, result){
            device.push({device: row});
        })

        query.on('end',function(result){
            client.end();
            console.log(device);
            res.send(device);
        })

    })

});

router.put('/', function(req, res, error){

    console.log('in panel put: ', req.body);

    var flipSwitch = {
        on: '58010301ff00ffffff',
        off: '58010301ff00000000',
        gattArgs: [
            '-i',
            'hci1',
            '-b',
            req.body.mac,
            '--char-write',
            '-a',
            '0x0028',
            '-n'
        ],
        state: req.body.device_on
    };

    //var arr = [
    //    '-i',
    //    'hci1',
    //    '-b',
    //    req.body.mac,
    //    '--char-write',
    //    '-a',
    //    '0x0028',
    //    '-n'
    //];

    //var flip;

    switch (req.body.device_on) {
        case true:
            flipSwitch.gattArgs.push(flipSwitch.off);
            flipSwitch.state = false;
            break;
        case false:
            flipSwitch.gattArgs.push(flipSwitch.on);
            flipSwitch.state = true;
            break;
    };

    //var turnOn = '58010301ff00ffffff';
    //var turnOff = '58010301ff00000000';


    //if(req.body.device_on === true){

        //arr.push(turnOff);
        console.log(flipSwitch.gattArgs, flipSwitch.state);

        pg.connect(connectionString, function(err, client, done){

            var query = client.query("UPDATE devices SET device_on='" + flipSwitch.state + "' where mac='" + req.body.mac + "'", function(error, result){
                if(error){console.log('there was an error ', error.detail);}
            })

            query.on('end',function(result){
                client.end();
                res.send(result);
            })

        });

        var child = spawn('gatttool', flipSwitch.gattArgs);

        child.stdout.on('data', function(data){

            res.send(data);

            child.kill();
        });

        child.on('exit', function(code){
            console.log('spawned process ended on exit code: ', code);
        });


    //};

//    if(req.body.device_on === false){
//
//        arr.push(turnOn);
//
//        pg.connect(connectionString, function(err, client, done){
//
//            var query = client.query("UPDATE devices SET device_on=true where mac='" + req.body.mac + "'", function(error, result){
//                if(error){console.log('there was an error ', error.detail);}
//            })
//
//            query.on('end',function(result){
//                client.end();
//                res.send(result);
//            })
//
//        });
//
//        var child = spawn('gatttool', arr);
//
//        child.stdout.on('data', function(data){
//
//            res.send(data);
//
//            child.kill();
//        });
//
//        child.on('exit', function(code){
//            console.log('spawned process ended on exit code: ', code);
//        });
//
//
//    }
//
//
});


module.exports = router;