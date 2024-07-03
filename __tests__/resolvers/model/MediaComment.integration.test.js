import { setupDatabase, cleanupDatabase, db } from '../../../setupTestDatabase';
import {
    insertMediaComment,
    getMediaCommentById,
    deleteMediaCommentById,
    updateMediaCommentById,
    getMediaCommentsByMediaId
} from '../../../src/resolvers/model/MediaComment';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';
import moment from "moment";

let container;

beforeAll(async () => {
    const setup = await setupDatabase();
    container = setup.container;
});

afterAll(async () => {
    await cleanupDatabase();
    await container.stop();
});

describe('MediaComment.js integration tests', () => {
    beforeEach(async () => {
        let today = moment().utc().toISOString();
        await db('MediaComment').del();
        await db('Media').del();
        await db('User').del();
        await db('Mimetype').del();

        await db('Mimetype').insert([
            { id: 1, type: 'image/png', category: 'IMAGE' }
        ]);

        await db('User').insert([
            { id: 1, username: 'testuser', password: 'password', admin: false, activation_key: 'key', created: today, updated: today },
            { id: 2, username: 'adminuser', password: 'password', admin: true, activation_key: 'key', created: today, updated: today }
        ]);

        await db('Media').insert([
            { id: 1, title: 'Test Media', url: 'http://example.com/media', userId: 1, mimetypeId: 1, filename: 'testfile.png', created: today, updated: today }
        ]);
    });

    it('should insert a media comment and return it', async () => {
        let today = moment().utc().toISOString();
        const newComment = {
            mediaId: 1,
            userId: 1,
            comment: 'This is a test comment',
            created: today,
            updated: today
        };

        const insertedComment = await insertMediaComment(db, newComment);
        expect(insertedComment.comment).toBe('This is a test comment');
    });

    it('should return a media comment by id', async () => {
        await db('MediaComment').insert({
            id: 1,
            mediaId: 1,
            userId: 1,
            comment: 'This is a test comment',
            created: moment().utc().toISOString(),
            updated: moment().utc().toISOString()
        });

        const comment = await getMediaCommentById(db, 1);
        expect(comment.comment).toBe('This is a test comment');
    });

    it('should delete a media comment by id', async () => {
        await db('MediaComment').insert({
            id: 1,
            mediaId: 1,
            userId: 1,
            comment: 'This is a test comment',
            created: moment().utc().toISOString(),
            updated: moment().utc().toISOString()
        });

        await deleteMediaCommentById(db, 1);

        const comment = await getMediaCommentById(db, 1);
        expect(comment).toBeUndefined();
    });

    it('should update a media comment by id', async () => {
        await db('MediaComment').insert({
            id: 1,
            mediaId: 1,
            userId: 1,
            comment: 'This is a test comment',
            created: moment().utc().toISOString(),
            updated: moment().utc().toISOString()
        });

        const updatedComment = {
            comment: 'This is an updated test comment',
            updated: moment().utc().toISOString()
        };

        await updateMediaCommentById(db, 1, updatedComment);

        const comment = await getMediaCommentById(db, 1);
        expect(comment.comment).toBe('This is an updated test comment');
    });

    it('should list media comments by mediaId', async () => {
        await db('MediaComment').insert([
            {
                id: 1,
                mediaId: 1,
                userId: 1,
                comment: 'This is the first comment',
                created: moment().utc().toISOString(),
                updated: moment().utc().toISOString()
            },
            {
                id: 2,
                mediaId: 1,
                userId: 2,
                comment: 'This is the second comment',
                created: moment().utc().toISOString(),
                updated: moment().utc().toISOString()
            }
        ]);

        const comments = await getMediaCommentsByMediaId(db, 1);
        expect(comments.length).toBe(2);
        expect(comments[0].comment).toBe('This is the first comment');
        expect(comments[1].comment).toBe('This is the second comment');
    });
});
