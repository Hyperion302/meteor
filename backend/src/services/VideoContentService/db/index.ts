import knex from 'knex';
import { appConfig } from '@/sharedInstances';

// Database Instance
export const knexInstance = knex({
  client: 'mysql2',
  connection: {
    host: appConfig.sql.host,
    user: appConfig.sql.user,
    password: appConfig.sql.pass,
    database: appConfig.sql.databases.videoContent,
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
});
