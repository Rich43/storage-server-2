exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.bigint('filesize').defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('filesize');
    });
};
