var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';


router.get('/', function(req, res, error){

    //console.log('in panel get');

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

    console.log('ONE', req.body.device_on);

    var on = '58010301ff00ffffff';
    var off = '58010301ff00000000';
    var gattArgs;

    //var flipSwitch = {
    //    on: '58010301ff00ffffff',
    //    off: '58010301ff00000000',
    //    gattArgs: [
    //        '-i',
    //        'hci1',
    //        '-b',
    //        req.body.mac,
    //        '--char-write',
    //        '-a',
    //        '0x0028',
    //        '-n'
    //    ],
    //    state: req.body.device_on
    //};


    switch (req.body.device_on) {
        case true:
            //flipSwitch.gattArgs.push(flipSwitch.off);
            //flipSwitch.state = false;
            req.body.device_on = false;
            gattArgs = call.buildGattargs(req.body.mac, off);
            break;
        case false:
            //flipSwitch.gattArgs.push(flipSwitch.on);
            //flipSwitch.state = true;
            req.body.device_on = true;
            gattArgs = call.buildGattargs(req.body.mac, on);
            break;
    };

    console.log('TWO')


    //pg.connect(connectionString, function(err, client, done){
    //
    //    var query = client.query("UPDATE devices SET device_on='" + flipSwitch.state + "' where mac='" + req.body.mac + "'", function(error, result){
    //        if(error){console.log('there was an error ', error.detail);}
    //    })
    //
    //    query.on('end',function(result){
    //        client.end();
    //        res.send(result);
    //    })
    //
    //});

    var child = spawn('gatttool', gattArgs);

    child.stdout.on('data', function(data){

        res.send(data);

        child.kill();
    });

    console.log('THREE')


    child.on('exit', function(code){
        console.log('spawned process ended on exit code: ', code);
        if(code === 0){

            console.log('gatttool run success');

            pg.connect(connectionString, function(err, client, done){

                var query = client.query("UPDATE devices SET device_on='" + req.body.device_on + "' where mac='" + req.body.mac + "'", function(error, result){
                    if(error){console.log('there was an error ', error.detail);}
                })

                query.on('end',function(result){
                    client.end();
                    res.send(result);
                })

            })

        }

        else {
            res.status(200).send('check hciconfig');
        }

    });

});


module.exports = router;