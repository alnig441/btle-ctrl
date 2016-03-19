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

    var tmp = req.body;
    var props = [];
    var values = [];

    for(var prop in tmp){
        var x = "'";
        if(prop !== 'setpoint' && prop !== 'offAtSunrise' && prop !== 'onAtSunset'){
            if(tmp[prop] !== null ){
                props.push(prop);
                x += tmp[prop];
                x += "'";
                values.push(x);
            }
            if(tmp[prop] === null){
                props.push(prop);
                values.push('null');
            }

        }
    }

    console.log('profile add: ', props.toString(), values.toString());

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("INSERT INTO profiles ("+ props.toString()+") values("+values.toString()+")", function(error, result){
            if(error){res.send(error);}
        })

        query.on('end',function(result){
            client.end();

            pg.connect(connectionString, function(err, client, done){
                var qurey = client.query("ALTER TABLE connectedprofiles ADD COLUMN " + tmp.profile_name + " BOOLEAN", function(error, result){
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

        var query = client.query("SELECT * FROM profiles WHERE active='true'", function(error, result){
            if(error){console.log('PETER there was an error ', error);}
        })

        query.on('row', function(row, result){
            profiles.push({profile: row});

        })

        query.on('end',function(result){
            client.end();
            //console.log('', profiles);
            res.send(profiles);
        })

    })


});

router.get('/all', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){
        var profiles = [];

        var query = client.query("SELECT * FROM profiles", function(error, result){
            if(error){console.log('Holly, there was an error ', error);}
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

    //console.log('.. GETTING CONNECTED PROFILES ... ', req.params);

    var profile = {};

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("select result.id, result.profile_name, result.turn_on, result.hour, result.minute, result.second, result.sunset, result.set, result.sunrise, result.rise from (profiles cross join (connectedprofiles cross join sundata)) as result WHERE result.profile_name='" + req.params.profile + "' AND result." + req.params.profile + "='true' AND result.active='true'", function(error, result){
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

router.put('/', function(req, res, error){

    //console.log('update profile: ', req.body);

    var tmp = req.body.profile;
    var props = [];
    var values = [];
    var modify;
    var type;

    tmp.active ? modify = 'ADD' : modify = 'DROP';
    tmp.active ? type = 'BOOLEAN' : type = "";

    //console.log('update profile: ', modify, type);

    for(var prop in tmp){
        var x = "'";
        if(tmp[prop] !== null){
            props.push(prop);
            x += tmp[prop];
            x += "'";
            values.push(x);
        }
        if(tmp[prop] === null){
            props.push(prop);
            values.push('null');
        }
    }

    //console.log(props.toString(), values.toString());

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("UPDATE profiles set ("+props.toString()+") = ("+values.toString()+") WHERE profile_name='"+tmp.profile_name+"'", function(error, result){
            if(error){
                console.log(error);
            }
        });
        query.on('end', function(result){
            client.end();

            pg.connect(connectionString, function(err, client, done){
                var qurey = client.query("ALTER TABLE connectedprofiles "+ modify +" COLUMN " + tmp.profile_name + " " + type, function(error, result){
                    if(error){
                        res.send(error);
                    }
                })
                query.on('end', function(result){
                    client.end();
                    res.send(result);
                })
            })

            //res.send(result);
        })
    })




});

router.delete('/:profile_name?', function(req, res, error){

    //console.log('profile delete: ', req.params);

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("DELETE FROM profiles * WHERE profile_name='"+req.params.profile_name+"'", function(error, result){
          if(error){
              console.log(error);
          }
        });

        query.on('end', function(result){

            pg.connect(connectionString, function(err, client, done){

                var query = client.query("ALTER TABLE connectedprofiles DROP COLUMN " + req.params.profile_name, function(error, result){
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

    })

});

module.exports = router;


