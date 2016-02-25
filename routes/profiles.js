var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.get('/on_at_sunset', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var on_at_sunset = [];
        var query = client.query("SELECT * FROM devices WHERE on_at_sunset ='true'", function(error, result){
            if(error){console.log('there was an error ', error);}
        })

        query.on('row', function(row, result){
            //console.log('in profiles: ', row);
            on_at_sunset.push(row);

        })

        query.on('end',function(result){
            client.end();
            //console.log(profiles);
            res.send(on_at_sunset);
        })

    })


});


router.get('/off_at_sunrise', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var on_at_sunset = [];
        var query = client.query("SELECT * FROM devices WHERE off_at_sunrise ='true'", function(error, result){
            if(error){console.log('there was an error ', error);}
        })

        query.on('row', function(row, result){
            //console.log('in profiles: ', row);
            on_at_sunset.push(row);

        })

        query.on('end',function(result){
            client.end();
            //console.log(profiles);
            res.send(on_at_sunset);
        })

    })


});

router.get('/master_off', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var on_at_sunset = [];
        var query = client.query("SELECT * FROM devices WHERE master_off ='true'", function(error, result){
            if(error){console.log('there was an error ', error);}
        })

        query.on('row', function(row, result){
            //console.log('in profiles: ', row);
            on_at_sunset.push(row);

        })

        query.on('end',function(result){
            client.end();
            //console.log(profiles);
            res.send(on_at_sunset);
        })

    })


});


router.post('/', function(req, res, error){

    req.body.on_at_sunset ? req.body.on_at_sunset = true : req.body.on_at_sunset = false;
    req.body.off_at_sunrise ? req.body.off_at_sunrise = true : req.body.off_at_sunrise = false;
    req.body.master_off ? req.body.master_off = true : req.body.master_off = false;


    pg.connect(connectionString, function(err, client, done){

        var query = client.query("UPDATE devices SET (on_at_sunset, off_at_sunrise, master_off) = ('"+ req.body.on_at_sunset +"', '" + req.body.off_at_sunrise + "', '" + req.body.master_off + "') WHERE  mac='" + req.body.mac + "'", function(error, result){
            if(error){console.log('there was an error ', error);}
        })
        query.on('end',function(result){
            client.end();
        })

    })

    //res.status(200);

});

module.exports = router;