exports.up = async function(knex) {
    await knex.schema.table('Media', function(table) {
        table.string('filename', 255).notNullable().defaultTo('');
    });

    await knex.raw(`
        CREATE TRIGGER validate_filename
        BEFORE INSERT ON Media
        FOR EACH ROW
        BEGIN
            IF LENGTH(NEW.filename) < 1 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Filename must be at least 1 character long.';
            END IF;
        END;
    `);
};

exports.down = async function(knex) {
    await knex.schema.table('Media', function(table) {
        table.dropColumn('filename');
    });

    await knex.raw('DROP TRIGGER IF EXISTS validate_filename;');
};
