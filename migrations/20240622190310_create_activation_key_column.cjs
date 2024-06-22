exports.up = function(knex) {
    return knex.schema.table('User', function(table) {
        table.uuid('activation_key').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('User', function(table) {
        table.dropColumn('activation_key');
    });
};
