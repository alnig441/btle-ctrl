var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

var runQuery = {

    update: function (state, mac) {

        pg.connect(connectionString, function (err, client, done) {

            var query = client.query("UPDATE devices SET device_on='" + state + "' where mac='" + mac + "'", function (error, result) {
                if (error) {
                    console.log('there was an error ', error.detail);
                }
            })

            query.on('end', function (result) {
                client.end();
                res.send(result);
            })

        });

    },

    select: function() {

        pg.connect(connectionString, function(err, client, done){

            var device = [];
            var query = client.query("SELECT * FROM devices ORDER BY location", function(error, result){
                if(error){console.log('there was an error ', error.detail);}
            });

            query.on('row', function(row, result){
                device.push({device: row});
            });

            query.on('end',function(result){
                client.end();
                //console.log(device);
                //res.send(device);
                return device;
            });

        })
        //return device;
    }

};

module.exports = runQuery;