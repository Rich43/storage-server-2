exports.up = function(knex) {
    return knex.schema.table('Thumbnail', function(table) {
        table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.table('Thumbnail', function(table) {
        table.dropColumn('created');
    });
};

