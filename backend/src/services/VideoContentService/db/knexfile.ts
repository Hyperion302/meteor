// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: 'video-content',
      user: 'devops',
      password: '',
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: 'migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'video-content',
      user: 'devops',
      password: '',
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: 'migrations',
    },
  },
};
