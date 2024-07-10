exports.up = function(knex) {
    return knex.schema.createTable('media_likes_dislikes', function(table) {
        table.increments('id').primary();
        table.integer('mediaId').unsigned().notNullable();
        table.integer('userId').unsigned().notNullable();
        table.enu('action', ['LIKE', 'DISLIKE']).notNullable();
        table.string('created').notNullable();
        table.string('updated').notNullable();

        table.foreign('mediaId').references('id').inTable('media');
        table.foreign('userId').references('id').inTable('user');

        table.unique(['mediaId', 'userId']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('media_likes_dislikes');
};
