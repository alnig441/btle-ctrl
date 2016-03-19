var express = require('express'),
    router = express.Router();
var pg = require('pg');
var call = require('../public/scripts/myFunctions.min.js');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.get('/', function(req, res, error){

    pg.connect(connectionString, function(err, client, done){

        var query = client.query("SELECT * FROM sundata", function(error, result){
            if(error){
                console.log(error);
            }
        });

        query.on('end', function(result){
            client.end();
            res.send(result.rows[0]);

        })

    })


});



module.exports = router;