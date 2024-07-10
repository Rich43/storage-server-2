exports.up = function(knex) {
    return knex.schema.table('user', function(table) {
        table.string('email', 255).notNullable().unique().after('username');
    });
};

exports.down = function(knex) {
    return knex.schema.table('user', function(table) {
        table.dropColumn('email');
    });
};
