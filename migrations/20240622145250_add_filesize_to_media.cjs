exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.bigint('filesize').notNullable().defaultTo(-1);
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('filesize');
    });
};
