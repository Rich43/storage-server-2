exports.up = function(knex) {
    return knex.schema
        .createTable('User', (table) => {
            table.increments('id').primary();
            table.string('username', 255).unique().notNullable();
            table.string('password', 255).notNullable();
            table.string('avatar', 255);
        })
        .createTable('Media', (table) => {
            table.increments('id').primary();
            table.string('title', 255).notNullable();
            table.text('url').notNullable();
            table.string('mimetype', 255).notNullable();
            table.string('thumbnail', 255);
            table.integer('userId').unsigned().notNullable();
            table.foreign('userId').references('User.id');
        })
        .createTable('Session', (table) => {
            table.increments('sessionId').primary();
            table.integer('userId').unsigned().notNullable();
            table.foreign('userId').references('User.id');
            table.string('sessionToken', 255).notNullable();
            table.timestamp('sessionExpireDateTime').notNullable();
            table.boolean('admin').notNullable();
        })
        .createTable('Thumbnail', (table) => {
            table.increments('id').primary();
            table.text('url').notNullable();
            table.integer('mediaId').unsigned().notNullable();
            table.foreign('mediaId').references('Media.id');
        })
        .createTable('Album', (table) => {
            table.increments('id').primary();
            table.string('title', 255).notNullable();
            table.integer('userId').unsigned().notNullable();
            table.foreign('userId').references('User.id');
        })
        .createTable('Album_Media', (table) => {
            table.integer('albumId').unsigned().notNullable();
            table.integer('mediaId').unsigned().notNullable();
            table.primary(['albumId', 'mediaId']);
            table.foreign('albumId').references('Album.id').onDelete('CASCADE');
            table.foreign('mediaId').references('Media.id').onDelete('CASCADE');
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('Album_Media')
        .dropTableIfExists('Album')
        .dropTableIfExists('Thumbnail')
        .dropTableIfExists('Session')
        .dropTableIfExists('Media')
        .dropTableIfExists('User');
};
