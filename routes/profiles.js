var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.get('/', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var profiles = [];
        var query = client.query("SELECT * FROM profiles", function(error, result){
            if(error){console.log('there was an error ', error);}
        })

        query.on('row', function(row, result){
            //console.log('in profiles: ', row);
            profiles.push({profile: row});

        })

        query.on('end',function(result){
            client.end();
            //console.log(profiles);
            res.send(profiles);
        })

    })


});

router.post('/', function(req, res, error){

    var devices = [];
    req.body.devices.push('zzzzzzzzzz');

    req.body.devices.sort().reduce(function(prev, curr, index, arr){
        prev = arr[index -1];

        if(prev != curr){
            devices.push(prev);
        }
    })

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("UPDATE profiles SET devices='{" + devices + "}' WHERE profile_name='"+ req.body.profile_name +"'", function(error, result){
            if(error){console.log('there was an error ', error);}
        })
        query.on('end',function(result){
            client.end();
        })

    })

    res.status(200);

});

module.exports = router;