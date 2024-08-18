exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.string('uploadedDate');
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropColumn('uploadedDate');
    });
};
