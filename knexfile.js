require('dotenv/config');
// Update with your config settings.

const { DATABASE_URL, DB } = process.env;
const config = {
  client: 'pg',
  connection: DATABASE_URL,
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};

module.exports = {
  production: config,
  development: config,
  test: {
    client: 'pg',
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    connection: DB,
  },
};
