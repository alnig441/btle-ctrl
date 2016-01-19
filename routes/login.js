var express = require('express'),
    router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';



router.post('/authenticate',
    function(req, res){

        console.log('authenticate: ', req.body);

        pg.connect(connectionString, function (err, client, done) {

            var query = client.query("SELECT * FROM USERS WHERE username='" + req.body.username +"'", function(error, result) {
                if (error) {
                    res.send(error.detail);
                }
                else if (result.rowCount > 0) {

                    console.log(result);

                    user = result.rows[0];

                    if(req.body.password !== user.password){
                        res.send(false);
                    }
                    else{
                        res.send(true);
                    }

                }
                else {
                    res.send('wrong username');
                }
            })
            //query.on('end', function (result) {
            //    console.log(result.rows[0].password);
            //    user = result.rows[0];
            //})
        })

    });

module.exports = router;