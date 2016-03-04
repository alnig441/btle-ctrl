var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE devices(id SERIAL PRIMARY KEY, mac TEXT UNIQUE NOT NULL, location VARCHAR(20), device_On BOOLEAN)');
//var query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(10) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL)');
//var query = client.query('CREATE TABLE profiles(profile_name VARCHAR(25) PRIMARY KEY, turn_on BOOLEAN, colour TEXT, hour INT, minute INT, recur_weekly BOOLEAN, recur_daily BOOLEAN)');
var query = client.query('CREATE TABLE connectedProfiles(id TEXT PRIMARY KEY NOT NULL)');

query.on('end', function(){
    client.end();
});
