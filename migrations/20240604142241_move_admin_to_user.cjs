/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.table('User', (table) => {
        table.boolean('admin').notNullable().defaultTo(false);
    });

    // Update User table to include admin field data from Session table
    await knex.raw(`
    UPDATE User
    SET admin = (
      SELECT Session.admin
      FROM Session
      WHERE Session.userId = User.id
      LIMIT 1
    )
  `);

    await knex.schema.table('Session', (table) => {
        table.dropColumn('admin');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.table('Session', (table) => {
        table.boolean('admin').notNullable().defaultTo(false);
    });

    // Update Session table to include admin field data from User table
    await knex.raw(`
    UPDATE Session
    SET admin = (
      SELECT User.admin
      FROM User
      WHERE User.id = Session.userId
      LIMIT 1
    )
  `);

    await knex.schema.table('User', (table) => {
        table.dropColumn('admin');
    });
};
