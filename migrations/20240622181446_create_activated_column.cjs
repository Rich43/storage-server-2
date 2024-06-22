exports.up = function(knex) {
    return knex.schema.table('User', function(table) {
        table.boolean('activated').notNullable().defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table('User', function(table) {
        table.dropColumn('activated');
    });
};
