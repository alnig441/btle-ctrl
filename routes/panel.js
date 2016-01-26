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

        //res.send(user);
    })


   //res.send('from panel get');

});

router.put('/', function(req, res, error) {

    console.log('right here: ', req.body);

    console.log(req.body.device_on === true);

    if(req.body.device_on === true){


        var child = spawn('sudo', ['gatttool', '-i', 'hci1', '-b', req.body.device.mac, '--char-write', '-a', '0x0028', '-n', '58010301ff00000000']);

        child.stdout.on('data', function(data){

            res.send(data);

            //child.kill();
        });

        child.on('exit', function(code){
            console.log('spawned process ended on exit code: ', code);
        });

        pg.connect(connectionString, function(err, client, done){
            if(err){console.log(err);}

            var query = client.query("UPDATE devices SET device_on=false WHERE mac='" + req.body.mac + "'", function(error, result){
                if(error){console.log(error.detail);}
            });

            query.on('end', function(result){
                client.end();
                res.send(result);

            });
        });


    };

    if(req.body.device_on === false){

        var child = spawn('sudo', ['gatttool', '-i', 'hci1', '-b', req.body.device.mac, '--char-write', '-a', '0x0028', '-n', '58010301ff00ffffff']);

        child.stdout.on('data', function(data){

            res.send(data);

            //child.kill();
        });

        child.on('exit', function(code){
            console.log('spawned process ended on exit code: ', code);
        });

        pg.connect(connectionString, function(err, client, done){
            if(err){console.log(err);}

            var query = client.query("UPDATE devices SET device_on=true WHERE mac='" + req.body.mac + "'", function(error, result){
                if(error){console.log(error.detail);}
            });

            query.on('end', function(result){
                client.end();
                res.send(result);

            });
        });


    };



});

module.exports = router;