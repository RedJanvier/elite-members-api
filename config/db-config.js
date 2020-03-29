import knex from 'knex';
import { config } from 'dotenv';

config();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssh: true,
  },
});

export default db;
