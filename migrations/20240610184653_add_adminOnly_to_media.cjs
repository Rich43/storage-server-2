exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.boolean('adminOnly').defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('adminOnly');
    });
};
