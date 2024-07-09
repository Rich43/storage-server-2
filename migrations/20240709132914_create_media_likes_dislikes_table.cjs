exports.up = function(knex) {
    return knex.schema.createTable('media_likes_dislikes', function(table) {
        table.increments('id').primary();
        table.integer('mediaId').unsigned().notNullable();
        table.integer('userId').unsigned().notNullable();
        table.enu('action', ['like', 'dislike']).notNullable();
        table.timestamp('created').defaultTo(knex.fn.now());
        table.timestamp('updated').defaultTo(knex.fn.now());

        table.foreign('mediaId').references('id').inTable('media').onDelete('CASCADE');
        table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');

        table.unique(['mediaId', 'userId']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('media_likes_dislikes');
};
