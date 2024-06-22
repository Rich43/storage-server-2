exports.up = async function(knex) {
    await knex.schema.table('Media', function(table) {
        // Drop foreign key constraint first
        table.dropForeign('thumbnail');
    });

    await knex.schema.table('Media', function(table) {
        table.integer('thumbnail_temp').unsigned();
    });

    // Copy the data from the old column to the new column
    await knex.raw('UPDATE Media SET thumbnail_temp = CAST(thumbnail AS UNSIGNED)');

    await knex.schema.table('Media', function(table) {
        table.dropColumn('thumbnail');
    });

    await knex.schema.table('Media', function(table) {
        table.renameColumn('thumbnail_temp', 'thumbnail');
        table.foreign('thumbnail').references('id').inTable('Media');
    });
};

exports.down = async function(knex) {
    await knex.schema.table('Media', function(table) {
        // Drop the new foreign key constraint
        table.dropForeign('thumbnail');
    });

    await knex.schema.table('Media', function(table) {
        table.string('thumbnail_temp', 255);
    });

    // Copy the data from the new column to the old column
    await knex.raw('UPDATE Media SET thumbnail_temp = thumbnail');

    await knex.schema.table('Media', function(table) {
        table.dropColumn('thumbnail');
    });

    await knex.schema.table('Media', function(table) {
        table.renameColumn('thumbnail_temp', 'thumbnail');
    });
};
