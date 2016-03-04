var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.post('/', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("UPDATE connectedprofiles SET ("+ req.body.name +") = ('" + req.body.value + "') WHERE id='" + req.body.mac + "'", function(error, result){
            if(err){
                res.send(err);
            }
        })
        query.on('end', function(result){
            client.end();
            res.send(result);
        })

    })


});

router.post('/add', function(req, res, error){

    console.log('profiles add: ', req.body);

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("INSERT INTO profiles (profile_name, turn_on) values($1, $2)", [req.body.name, req.body.state], function(error, result){
            if(error){res.send(error);}
        })

        query.on('end',function(result){
            client.end();

            pg.connect(connectionString, function(err, client, done){

                var query = client.query("ALTER TABLE connectedprofiles ADD COLUMN "+ req.body.name +" BOOLEAN", function(error, result){
                    if(error){
                        res.send(error);
                    }
                })
                query.on('end', function(result){
                    client.end();
                    res.send(result);
                })
            })

        })

    });


});

router.get('/', function(req, res, error){

    console.log('.. GETTING PROFILES .. ');

    pg.connect(connectionString, function(err, client, done){
        var profiles = [];

        var query = client.query("SELECT * FROM profiles", function(error, result){
            if(error){console.log('PETER there was an error ', error);}
        })

        query.on('row', function(row, result){
            profiles.push({profile: row});


        })

        query.on('end',function(result){
            client.end();
            res.send(profiles);
        })

    })


});

router.get('/:profile?', function(req, res, error){

    console.log('.. GETTING CONNECTED PROFILES ... ', req.params);

    var profile = {};

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("SELECT result.id FROM (profiles CROSS JOIN connectedprofiles)as result WHERE result.profile_name='" + req.params.profile + "' AND result." + req.params.profile + "='true'", function(error, result){
            if(error){console.log('JOHN there was an error ', error);}
        })

        query.on('row', function(row, result){

        })

        query.on('end',function(result){
            client.end();
            profile = result.rows;
            res.send(profile);
        })

    })


});

module.exports = router;