const knex = require('knex');
const { config } = require('dotenv');

config();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssh: true
  }
});

module.exports = db;
