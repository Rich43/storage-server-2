// noinspection DuplicatedCode

exports.up = function(knex) {
    return knex.schema.createTable('MediaComment', function(table) {
        table.increments('id').primary();
        table.integer('mediaId').unsigned().notNullable();
        table.integer('userId').unsigned().notNullable();
        table.text('comment').notNullable();
        table.timestamp('created').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated').defaultTo(knex.fn.now()).notNullable();

        table.foreign('mediaId').references('id').inTable('Media');
        table.foreign('userId').references('id').inTable('User');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('MediaComment');
};
