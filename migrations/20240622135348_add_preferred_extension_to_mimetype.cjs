
exports.up = function(knex) {
    return knex.schema.table('Mimetype', function(table) {
        table.string('preferred_extension', 255).notNullable().defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Mimetype', function(table) {
        table.dropColumn('preferred_extension');
    });
};
