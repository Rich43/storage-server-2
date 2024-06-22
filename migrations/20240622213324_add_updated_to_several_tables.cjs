const tables = ['User', 'Session', 'Media', 'Album'];

exports.up = async function(knex) {
    for (const table of tables) {
        await knex.schema.table(table, function(table) {
            table.timestamp('updated').notNullable().defaultTo(knex.fn.now());
        });
    }
};

exports.down = async function(knex) {
    for (const table of tables) {
        await knex.schema.table(table, function(table) {
            table.dropColumn('updated');
        });
    }
};
