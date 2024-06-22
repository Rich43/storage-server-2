exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.string('filename', 255).defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('filename');
    });
};
