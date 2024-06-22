exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.boolean('uploaded').notNullable().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('uploaded');
    });
};
