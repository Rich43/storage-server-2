exports.up = function(knex) {
    return knex.schema.table('Mimetype', function(table) {
        table.string('extension', 255).notNullable().defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Mimetype', function(table) {
        table.dropColumn('extension');
    });
};
