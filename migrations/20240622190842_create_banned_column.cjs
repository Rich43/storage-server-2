exports.up = function(knex) {
    return knex.schema.table('User', function(table) {
        table.boolean('banned').notNullable().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table('User', function(table) {
        table.dropColumn('banned');
    });
};
