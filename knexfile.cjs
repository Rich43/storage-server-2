/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: 'storage',
      user:     'root',
      password: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds',
      stub: './seeds/stub.js' // Add this line to specify the stub template
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'storage',
      user:     'root',
      password: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds',
      stub: './seeds/stub.js' // Add this line to specify the stub template
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'storage',
      user:     'root',
      password: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds',
      stub: './seeds/stub.js' // Add this line to specify the stub template
    }
  }
};
