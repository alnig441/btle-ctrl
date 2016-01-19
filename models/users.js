var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('username VARCHAR(10) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL');

query.on('end', function() { client.end(); });