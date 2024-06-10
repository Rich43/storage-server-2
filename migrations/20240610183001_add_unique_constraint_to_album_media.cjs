exports.up = function(knex) {
    return knex.schema.alterTable('Album_Media', function(table) {
        table.unique(['albumId', 'mediaId']);
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('Album_Media', function(table) {
        table.dropUnique(['albumId', 'mediaId']);
    });
};
