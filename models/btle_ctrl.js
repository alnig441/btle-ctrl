var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/btle-ctrl';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE devices(id SERIAL PRIMARY KEY, mac TEXT UNIQUE NOT NULL, location VARCHAR(20), device_On BOOLEAN)');
var query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(10) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL)');
var query = client.query('CREATE TABLE profiles(id SERIAL PRIMARY KEY, profile_name VARCHAR(25) UNIQUE NOT NULL, devices TEXT[], device_On BOOLEAN)');


query.on('end', function(){
    client.end();
});
