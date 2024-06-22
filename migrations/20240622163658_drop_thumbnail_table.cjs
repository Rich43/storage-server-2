exports.up = function(knex) {
    return knex.schema.dropTableIfExists('Thumbnail');
};

exports.down = function(knex) {
    return knex.schema.createTable('Thumbnail', (table) => {
        table.increments('id').primary();
        table.text('url').notNullable();
        table.integer('mediaId').unsigned().notNullable();
        table.foreign('mediaId').references('Media.id');
    });
};
