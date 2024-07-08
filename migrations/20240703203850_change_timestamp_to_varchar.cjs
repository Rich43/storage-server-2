const tables = ['User', 'Session', 'Media', 'Album', 'MediaComment'];

exports.up = async function(knex) {
    for (const table of tables) {
        await knex.schema.alterTable(table, (t) => {
            t.string('created').alter();
            t.string('updated').alter();
        });
    }
};

exports.down = async function(knex) {
    for (const table of tables) {
        await knex.schema.alterTable(table, (t) => {
            t.timestamp('created').defaultTo(knex.fn.now()).alter();
            t.timestamp('updated').defaultTo(knex.fn.now()).alter();
        });
    }
};
