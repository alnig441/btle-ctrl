var express = require('express'),
    router = express.Router();
var pg = require('pg');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var call = require('../public/scripts/myFunctions.min.js');


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

//router.get('/on_at_sunset', function(req, res, error){
//
//    pg.connect(connectionString, function(err, client, done){
//
//        var on_at_sunset = [];
//        var query = client.query("SELECT * FROM devices WHERE on_at_sunset ='true'", function(error, result){
//            if(error){console.log('JESPER there was an error ', error);}
//        })
//
//        query.on('row', function(row, result){
//            //console.log('in profiles: ', row);
//            on_at_sunset.push(row);
//
//        })
//
//        query.on('end',function(result){
//            client.end();
//            //console.log(profiles);
//            res.send(on_at_sunset);
//        })
//
//    })
//
//
//});


//router.get('/off_at_sunrise', function(req, res, error){
//
//    pg.connect(connectionString, function(err, client, done){
//
//        var on_at_sunset = [];
//        var query = client.query("SELECT * FROM devices WHERE off_at_sunrise ='true'", function(error, result){
//            if(error){console.log('ANDERS there was an error ', error);}
//        })
//
//        query.on('row', function(row, result){
//            //console.log('in profiles: ', row);
//            on_at_sunset.push(row);
//
//        })
//
//        query.on('end',function(result){
//            client.end();
//            //console.log(profiles);
//            res.send(on_at_sunset);
//        })
//
//    })
//
//
//});

//router.get('/master_off', function(req, res, error){
//
//    pg.connect(connectionString, function(err, client, done){
//
//        var on_at_sunset = [];
//        var query = client.query("SELECT * FROM devices WHERE master_off ='true'", function(error, result){
//            if(error){console.log('RASMUS there was an error ', error);}
//        })
//
//        query.on('row', function(row, result){
//            //console.log('in profiles: ', row);
//            on_at_sunset.push(row);
//
//        })
//
//        query.on('end',function(result){
//            client.end();
//            //console.log(profiles);
//            res.send(on_at_sunset);
//        })
//
//    })
//
//
//});


router.post('/', function(req, res, error){

    console.log('profiles post: ');

    var profiles = req.body.profiles;

    profiles.forEach(function(elem, index, array){

        console.log(elem.name);

        pg.connect(connectionString, function(err, client, done){

            var query = client.query("UPDATE connectedprofiles SET ("+ elem.name +") = ('" + elem.value + "') WHERE id='" + req.body.mac + "'", function(error, result){
                if(err){
                    res.send(err);
                }
            })
            query.on('end', function(result){
                client.end();
            })

        })

    });

});

router.post('/add', function(req, res, error){

    console.log('profiles add: ', req.body);

    //var obj = {name: req.body.name, value: req.body.state};
    //
    //console.log(obj);

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