exports.up = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.integer('thumbnail').unsigned().references('id').inTable('Media').alter();
    });
};

exports.down = function(knex) {
    return knex.schema.table('Media', function(table) {
        table.dropForeign('thumbnail');
        table.dropColumn('thumbnail');
        table.string('thumbnail');
    });
};
