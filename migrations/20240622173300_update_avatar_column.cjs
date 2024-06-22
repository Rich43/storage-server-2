
exports.up = async function(knex) {
    await knex.schema.table('user', function(table) {
        // Add a temporary column to store the new foreign key values
        table.integer('avatar_temp').unsigned();
    });

    // Assuming the existing avatar column contains media IDs as strings
    await knex.raw('UPDATE user SET avatar_temp = CAST(avatar AS UNSIGNED)');

    await knex.schema.table('user', function(table) {
        table.dropColumn('avatar');
    });

    await knex.schema.table('user', function(table) {
        table.renameColumn('avatar_temp', 'avatar');
        table.foreign('avatar').references('id').inTable('media');
    });
};

exports.down = async function(knex) {
    await knex.schema.table('user', function(table) {
        // Drop the new foreign key constraint
        table.dropForeign('avatar');
    });

    await knex.schema.table('user', function(table) {
        table.string('avatar_temp', 255);
    });

    // Copy the data from the new column back to the old column
    await knex.raw('UPDATE user SET avatar_temp = avatar');

    await knex.schema.table('user', function(table) {
        table.dropColumn('avatar');
    });

    await knex.schema.table('user', function(table) {
        table.renameColumn('avatar_temp', 'avatar');
    });
};
