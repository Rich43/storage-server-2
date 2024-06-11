exports.up = function(knex) {
    return knex.schema.alterTable('Mimetype', function(table) {
        table.enu('category', ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER']).alter();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('Mimetype', function(table) {
        table.enu('category', ['IMAGE', 'VIDEO', 'AUDIO', 'OTHER']).alter();
    });
};
