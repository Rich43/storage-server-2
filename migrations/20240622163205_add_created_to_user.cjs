exports.up = function(knex) {
    return knex.schema.table('User', function(table) {
        table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.table('User', function(table) {
        table.dropColumn('created');
    });
};
