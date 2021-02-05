import knex from 'knex';
import * as config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';

const envConfig = config[environment];

export default knex(envConfig);
