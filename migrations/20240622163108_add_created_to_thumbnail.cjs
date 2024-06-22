exports.up = function(knex) {
    return knex.schema.table('Thumbnail', function(table) {
        table.timestamp('created').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.table('Thumbnail', function(table) {
        table.dropColumn('created');
    });
};

