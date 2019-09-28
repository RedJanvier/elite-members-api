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
    connection: 'postgres://postgres:Jannyda1.postgres@localhost:5432/elite'
});

module.exports = db1;