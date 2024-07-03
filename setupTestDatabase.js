import { GenericContainer } from 'testcontainers';
import knex from 'knex';

let db;

export async function setupDatabase() {
    const container = await new GenericContainer('mysql')
        .withEnvironment({ MYSQL_ROOT_PASSWORD: 'root', MYSQL_DATABASE: 'test' })
        .withExposedPorts(3306)
        .start();

    const port = container.getMappedPort(3306);
    const host = container.getHost();

    db = knex({
        client: 'mysql2',
        connection: {
            host,
            port,
            user: 'root',
            password: 'root',
            database: 'test'
        }
    });

    await db.schema.createTable('knex_migrations', (table) => {
        table.increments('id').primary();
        table.string('name', 255);
        table.integer('batch');
        table.timestamp('migration_time');
    });

    await db.schema.createTable('knex_migrations_lock', (table) => {
        table.increments('index').primary();
        table.integer('is_locked');
    });

    await db.schema.createTable('mimetype', (table) => {
        table.increments('id').primary();
        table.string('type', 255).notNullable();
        table.enu('category', ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER']);
        table.string('extension', 255).defaultTo('').notNullable();
        table.string('preferred_extension', 255).defaultTo('').notNullable();
    });

    await db.schema.createTable('media', (table) => {
        table.increments('id').primary();
        table.string('title', 255).notNullable();
        table.text('url').notNullable();
        table.integer('userId').unsigned().notNullable();
        table.integer('mimetypeId').unsigned().references('id').inTable('mimetype').onDelete('CASCADE');
        table.boolean('adminOnly').defaultTo(false).notNullable();
        table.string('filename', 255).defaultTo('').notNullable();
        table.string('user_extension', 255).defaultTo('');
        table.bigInteger('filesize').defaultTo(-1).notNullable();
        table.boolean('uploaded').defaultTo(false).notNullable();
        table.timestamp('created').defaultTo(db.fn.now()).notNullable();
        table.integer('thumbnail').unsigned().references('id').inTable('media');
        table.timestamp('updated').defaultTo(db.fn.now()).notNullable();
    });

    await db.raw(`
        CREATE TRIGGER validate_filename
        BEFORE INSERT ON media
        FOR EACH ROW
        BEGIN
            IF LENGTH(NEW.filename) < 1 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Filename must be at least 1 character long.';
            END IF;
        END;
    `);

    await db.schema.createTable('user', (table) => {
        table.increments('id').primary();
        table.string('username', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.boolean('admin').defaultTo(false).notNullable();
        table.timestamp('created').defaultTo(db.fn.now()).notNullable();
        table.integer('avatar').unsigned().references('id').inTable('media');
        table.boolean('activated').defaultTo(false).notNullable();
        table.string('activation_key', 36).notNullable();
        table.boolean('banned').defaultTo(false).notNullable();
        table.timestamp('updated').defaultTo(db.fn.now()).notNullable();
    });

    await db.schema.createTable('album', (table) => {
        table.increments('id').primary();
        table.string('title', 255).notNullable();
        table.integer('userId').unsigned().references('id').inTable('user');
        table.timestamp('created').defaultTo(db.fn.now()).notNullable();
        table.timestamp('updated').defaultTo(db.fn.now()).notNullable();
    });

    await db.schema.createTable('album_media', (table) => {
        table.integer('albumId').unsigned().notNullable();
        table.integer('mediaId').unsigned().notNullable().references('id').inTable('media').onDelete('CASCADE');
        table.primary(['albumId', 'mediaId']);
        table.unique(['albumId', 'mediaId']);
        table.foreign('albumId').references('id').inTable('album').onDelete('CASCADE');
    });

    await db.schema.alterTable('media', (table) => {
        table.foreign('userId').references('id').inTable('user');
    });

    await db.schema.createTable('session', (table) => {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable().references('id').inTable('user');
        table.string('sessionToken', 36).notNullable();
        table.timestamp('sessionExpireDateTime').notNullable();
        table.timestamp('created').defaultTo(db.fn.now()).notNullable();
        table.timestamp('updated').defaultTo(db.fn.now()).notNullable();
    });

    return { container, db };
}

export async function cleanupDatabase() {
    await db.destroy();
}

export { db };
