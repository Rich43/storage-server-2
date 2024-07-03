import { setupDatabase, cleanupDatabase, db } from '../../../setupTestDatabase';
import {
    getMediaQuery,
    getFirstMediaItemWithImageMimetypeById,
    insertMedia,
    getMediaById,
    getMediaByIdJoiningOntoMimeType,
    getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype,
    deleteMediaById,
    addAdminOnlyRestriction,
    addRelatedKeywords,
    updateMediaById
} from '../../../src/resolvers/model/Media';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';

let container;

beforeAll(async () => {
    const setup = await setupDatabase();
    container = setup.container;
});

afterAll(async () => {
    await cleanupDatabase();
    await container.stop();
});

describe('Media.js integration tests', () => {
    beforeEach(async () => {
        await db('album_media').del();
        await db('album').del();
        await db('media').del();
        await db('user').del();
        await db('mimetype').del();

        await db('mimetype').insert([
            { id: 1, type: 'image/png', category: 'IMAGE' }
        ]);

        await db('user').insert([
            { id: 1, username: 'testuser', password: 'password', admin: false, activation_key: 'key' },
            { id: 2, username: 'adminuser', password: 'password', admin: true, activation_key: 'key' }
        ]);
    });

    it('should create a media query with category and admin check for non-admin user', async () => {
        const user = { admin: false };
        const category = 'IMAGE';
        const query = getMediaQuery(db, user, category);
        const sql = query.toString();
        expect(sql).toContain('`Mimetype`.`category` = \'IMAGE\'');
        expect(sql).toContain('`Media`.`adminOnly` = false');
    });

    it('should create a media query with category and no admin check for admin user', async () => {
        const user = { admin: true };
        const category = 'IMAGE';
        const query = getMediaQuery(db, user, category);
        const sql = query.toString();
        expect(sql).toContain('`Mimetype`.`category` = \'IMAGE\'');
        expect(sql).not.toContain('`Media`.`adminOnly` = false');
    });

    it('should return the first media item with image mimetype by id', async () => {
        await db('media').insert({
            id: 1,
            title: 'Test Image',
            url: 'http://example.com/image.png',
            userId: 1,
            mimetypeId: 1,
            filename: 'testfile.png' // Ensure filename > 1 character
        });

        const media = await getFirstMediaItemWithImageMimetypeById(db, 1);
        expect(media.title).toBe('Test Image');
    });

    it('should insert media and return the id', async () => {
        await db('media').insert({
            id: 1,
            title: 'Test Image',
            url: 'http://example.com/image.png',
            userId: 1,
            mimetypeId: 1,
            filename: 'testfile.png' // Ensure filename > 1 character
        });

        const user = { userId: 1, admin: false };
        const input = {
            title: 'Test Title',
            description: 'Test Description',
            url: 'http://test.url',
            mimetype: 'image/png',
            thumbnail: 1,
            filename: 'testfile',
            filesize: 1000,
            uploaded: true,
            user_extension: '.png'
        };
        const mediaAdminOnly = false;
        const mimetypeId = 1;

        const [mediaId] = await insertMedia(db, user, mediaAdminOnly, input, mimetypeId);
        expect(mediaId).toBeDefined();
    });

    it('should return media by id', async () => {
        await db('media').insert({
            id: 1,
            title: 'Test Title',
            url: 'http://test.url',
            userId: 1,
            mimetypeId: 1,
            filename: 'testfile.png' // Ensure filename > 1 character
        });

        const media = await getMediaById(db, 1);
        expect(media.title).toBe('Test Title');
    });

    it('should delete media by id', async () => {
        await db('media').insert({
            id: 1,
            title: 'Test Title',
            url: 'http://test.url',
            userId: 1,
            mimetypeId: 1,
            filename: 'testfile.png' // Ensure filename > 1 character
        });

        await deleteMediaById(db, 1);

        const media = await getMediaById(db, 1);
        expect(media).toBeUndefined();
    });

    it('should add adminOnly restriction for non-admin user', async () => {
        const userSession = { admin: false };
        let query = db('media').where('id', 1);
        query = addAdminOnlyRestriction(userSession, query);
        const sql = query.toString();
        expect(sql).toContain('`Media`.`adminOnly` = false');
    });

    it('should not add adminOnly restriction for admin user', async () => {
        const userSession = { admin: true };
        let query = db('media').where('id', 1);
        query = addAdminOnlyRestriction(userSession, query);
        const sql = query.toString();
        expect(sql).not.toContain('`Media`.`adminOnly` = false');
    });

    it('should update media by id', async () => {
        await db('media').insert({
            id: 1,
            title: 'Original Title',
            url: 'http://test.url',
            userId: 1,
            mimetypeId: 1,
            filename: 'testfile.png' // Ensure filename > 1 character
        });

        const updatedMedia = {
            title: 'Updated Title'
        };

        await updateMediaById(db, 1, updatedMedia);

        const media = await getMediaById(db, 1);
        expect(media.title).toBe('Updated Title');
    });

    it('should return media by id joining onto mimetype', async () => {
        await db('media').insert({
            id: 1,
            title: 'Test Title',
            url: 'http://test.url',
            userId: 1,
            mimetypeId: 1,
            filename: 'testfile.png' // Ensure filename > 1 character
        });

        const media = await getMediaByIdJoiningOntoMimeType(db, 1);
        expect(media.title).toBe('Test Title');
        expect(media.mimetype).toBe('image/png');
    });

    it('should add related keywords to query', async () => {
        await db('media').insert([
            {
                id: 1,
                title: 'First Media',
                description: 'This is the first media',
                url: 'http://test.url',
                userId: 1,
                mimetypeId: 1,
                filename: 'testfile.png' // Ensure filename > 1 character
            },
            {
                id: 2,
                title: 'Second Media',
                description: 'This is the second media',
                url: 'http://test.url',
                userId: 1,
                mimetypeId: 1,
                filename: 'testfile2.png' // Ensure filename > 1 character
            }
        ]);

        const keywords = ['second'];
        const query = addRelatedKeywords(db, 1, keywords);
        const results = await query;

        expect(results.length).toBe(1);
        expect(results[0].id).toBe(2);
    });

    it('should return media by album id joining onto album_media and mimetype', async () => {
        await db('album').insert({
            id: 1,
            title: 'Test Album',
            userId: 1
        });

        await db('media').insert([
            {
                id: 1,
                title: 'First Media',
                description: 'This is the first media',
                url: 'http://test.url',
                userId: 1,
                mimetypeId: 1,
                filename: 'testfile.png' // Ensure filename > 1 character
            },
            {
                id: 2,
                title: 'Second Media',
                description: 'This is the second media',
                url: 'http://test.url',
                userId: 1,
                mimetypeId: 1,
                filename: 'testfile2.png' // Ensure filename > 1 character
            }
        ]);

        await db('album_media').insert([
            { albumId: 1, mediaId: 1 },
            { albumId: 1, mediaId: 2 }
        ]);

        const media = await getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype(db, 1);
        expect(media.length).toBe(2);
        expect(media[0].title).toBe('First Media');
        expect(media[1].title).toBe('Second Media');
    });
});
