exports.up = function(knex) {
    return knex.schema.table('media', function(table) {
        table.bigInteger('view_count').defaultTo(0).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('media', function(table) {
        table.dropColumn('view_count');
    });
};
