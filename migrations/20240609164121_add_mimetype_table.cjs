exports.up = function(knex) {
    return knex.schema
        .createTable('Mimetype', function(table) {
            table.increments('id').primary();
            table.string('type').notNullable();
            table.enu('category', ['VIDEO', 'AUDIO', 'IMAGE', 'OTHER']).notNullable();
        })
        .then(function() {
            return knex.schema.table('Media', function(table) {
                table.integer('mimetypeId').unsigned().references('id').inTable('Mimetype').onDelete('CASCADE');
                table.dropColumn('mimetype');
            });
        });
};

exports.down = function(knex) {
    return knex.schema
        .table('Media', function(table) {
            table.dropColumn('mimetypeId');
            table.string('mimetype').notNullable();
        })
        .then(function() {
            return knex.schema.dropTable('Mimetype');
        });
};

