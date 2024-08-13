import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { cleanupDatabase, db, setupDatabase } from '../../../setupTestDatabase';
import {
    createLikeDislike,
    deleteLikeDislike,
    getDislikeCountByMediaId,
    getDislikesByMediaId,
    getDislikesByUserId,
    getLikeCountByMediaId,
    getLikesByMediaId,
    getLikesByUserId,
    updateLikeDislike
} from '../../../src/resolvers/model/MediaLikesDislikes';
import moment from "moment";

let container;
let today = moment().utc().toISOString();

beforeAll(async () => {
    const setup = await setupDatabase();
    container = setup.container;
});

afterAll(async () => {
    await cleanupDatabase();
    await container.stop();
});

beforeEach(async () => {
    await db('media_likes_dislikes').del();
    await db('media').del();
    await db('user').del();
    await db('mimetype').del();

    await db('mimetype').insert([
        { id: 1, type: 'image/png', category: 'IMAGE' },
        { id: 2, type: 'video/mp4', category: 'VIDEO' },
    ]);

    await db('user').insert([
        { id: 1, username: 'testuser', password: 'password', email: 'fred@example.com', admin: false, activation_key: 'key', created: today, updated: today },
        { id: 2, username: 'adminuser', password: 'password', email: 'bob@monkhouse.com', admin: true, activation_key: 'key', created: today, updated: today }
    ]);

    await db('media').insert({
        id: 1,
        title: 'Test Image',
        url: 'https://example.com/image.png',
        userId: 1,
        mimetypeId: 1,
        filename: 'testfile.png',
        created: today,
        updated: today
    });
});

describe('MediaLikesDislikes Model', () => {
    it('getLikesByMediaId should return likes for a given mediaId', async () => {
        await db('media_likes_dislikes').insert({ mediaId: 1, userId: 1, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() });
        const likes = await getLikesByMediaId(db, 1);
        expect(likes).toHaveLength(1);
        expect(likes[0]).toMatchObject({ mediaId: 1, userId: 1, action: 'LIKE' });
    });

    it('getDislikesByMediaId should return dislikes for a given mediaId', async () => {
        await db('media_likes_dislikes').insert({ mediaId: 1, userId: 1, action: 'DISLIKE', created: new Date().toISOString(), updated: new Date().toISOString() });
        const dislikes = await getDislikesByMediaId(db, 1);
        expect(dislikes).toHaveLength(1);
        expect(dislikes[0]).toMatchObject({ mediaId: 1, userId: 1, action: 'DISLIKE' });
    });

    it('getLikesByUserId should return likes for a given userId', async () => {
        await db('media_likes_dislikes').insert({ mediaId: 1, userId: 1, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() });
        const likes = await getLikesByUserId(db, 1);
        expect(likes).toHaveLength(1);
        expect(likes[0]).toMatchObject({ mediaId: 1, userId: 1, action: 'LIKE' });
    });

    it('getDislikesByUserId should return dislikes for a given userId', async () => {
        await db('media_likes_dislikes').insert({ mediaId: 1, userId: 1, action: 'DISLIKE', created: new Date().toISOString(), updated: new Date().toISOString() });
        const dislikes = await getDislikesByUserId(db, 1);
        expect(dislikes).toHaveLength(1);
        expect(dislikes[0]).toMatchObject({ mediaId: 1, userId: 1, action: 'DISLIKE' });
    });

    it('createLikeDislike should create a like/dislike record', async () => {
        const input = { mediaId: 1, userId: 1, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() };
        const record = await createLikeDislike(db, input);
        expect(record).toMatchObject(input);
    });

    it('updateLikeDislike should update a like/dislike record', async () => {
        const input = { mediaId: 1, userId: 1, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() };
        const [id] = await db('media_likes_dislikes').insert(input);
        const updatedRecord = await updateLikeDislike(db, id, { action: 'DISLIKE', updated: new Date().toISOString() });
        expect(updatedRecord).toMatchObject({ id, mediaId: 1, userId: 1, action: 'DISLIKE' });
    });

    it('deleteLikeDislike should delete a like/dislike record', async () => {
        const input = { mediaId: 1, userId: 1, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() };
        const [id] = await db('media_likes_dislikes').insert(input);
        const deletedRecord = await deleteLikeDislike(db, id);
        expect(deletedRecord).toMatchObject(input);
        const remainingRecords = await db('media_likes_dislikes').where({ id });
        expect(remainingRecords).toHaveLength(0);
    });

    it('getLikeCountByMediaId should return the count of likes for a given mediaId', async () => {
        await db('media_likes_dislikes').insert([
            { mediaId: 1, userId: 1, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() },
            { mediaId: 1, userId: 2, action: 'LIKE', created: new Date().toISOString(), updated: new Date().toISOString() }
        ]);
        const result = await getLikeCountByMediaId(db, 1);
        expect(result[0]['count(*)']).toBe(2);
    });

    it('getDislikeCountByMediaId should return the count of dislikes for a given mediaId', async () => {
        await db('media_likes_dislikes').insert([
            { mediaId: 1, userId: 1, action: 'DISLIKE', created: new Date().toISOString(), updated: new Date().toISOString() },
            { mediaId: 1, userId: 2, action: 'DISLIKE', created: new Date().toISOString(), updated: new Date().toISOString() }
        ]);
        const result = await getDislikeCountByMediaId(db, 1);
        expect(result[0]['count(*)']).toBe(2);
    });
});
