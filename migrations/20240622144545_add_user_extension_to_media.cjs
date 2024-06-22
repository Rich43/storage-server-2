exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.string('user_extension', 255).defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('user_extension');
    });
};
