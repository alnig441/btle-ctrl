var express = require('express'),
    router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

router.put('/', function(req, res, error){

});

router.get('/', function(req, res, error){

});

router.post('/', function(req, res, error){

});

router.delete('/', function(req, res, error){

});

module.exports = router;