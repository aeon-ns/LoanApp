// db.js
const knex = require('knex');
const config = require('./knexfile');

// @ts-ignore
const connection = knex(config);

module.exports = connection;

connection.once('connection', () => {
    console.log('Mysql connected');
})
