exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.text('description').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('description');
    });
};
