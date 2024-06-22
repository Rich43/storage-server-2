exports.up = function(knex) {
    return knex.schema.table('User', function(table) {
        table.timestamp('activated').defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table('User', function(table) {
        table.dropColumn('activated');
    });
};
