const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssh: true
  }
});

const db1 = knex({
  client: 'pg',
  connection: 'postgres://postgres:<password>.postgres@localhost:5432/dbname'
});

module.exports = db1;
