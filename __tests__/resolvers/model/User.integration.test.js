import { cleanupDatabase, db, setupDatabase } from '../../../setupTestDatabase';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { __ALL__ as utils } from "../../../src/resolvers/utils/utils.js";
import {
    createNewUser,
    findActivationKey,
    getUserById,
    getUserCount,
    getUserFromToken,
    updateActivationKey,
    updateUserAvatar,
    validateUser,
} from "../../../src/resolvers/model/User.js";

describe('User model integration tests', () => {
    const now = utils.moment().utc().toISOString();
    let userId;

    beforeAll(async () => {
        await setupDatabase();
    });

    afterAll(async () => {
        await cleanupDatabase();
    });

    beforeEach(async () => {
        await db('mimetype').del();

        await db('mimetype').insert([
            { id: 1, type: 'image/png', category: 'IMAGE' },
            { id: 2, type: 'video/mp4', category: 'VIDEO' },
        ]);
        await db('Session').del();
        await db('User').del();
        await db('User').insert({
            username: 'testuser',
            password: 'hashedPassword',
            email: 'jane@example.com',
            admin: false,
            avatar: null,
            activated: false,
            activation_key: 'activation-key',
            banned: false,
            created: now,
            updated: now,
        });

        const user = await db('User').where({ username: 'testuser' }).first();
        userId = user.id;
    });

    it('should validate user with correct credentials', async () => {
        const user = await validateUser(db, 'testuser', 'hashedPassword');
        expect(user).toMatchObject({
            username: 'testuser',
            password: 'hashedPassword',
        });
    });

    it('should not validate user with incorrect credentials', async () => {
        const user = await validateUser(db, 'testuser', 'wrongPassword');
        expect(user).toBeUndefined();
    });

    it('should get user from token', async () => {
        await db('Session').insert({
            userId,
            sessionToken: 'valid-token',
            sessionExpireDateTime: utils.moment().add(1, 'hour').utc().toISOString(),
            created: now,
            updated: now,
        });

        const user = await getUserFromToken(db, 'valid-token');
        expect(user).toMatchObject({
            admin: 0,
        });
    });

    it('should throw error if user not found from token', async () => {
        await expect(getUserFromToken(db, 'invalid-token')).rejects.toThrow('User not found');
    });

    it('should find activation key', async () => {
        const user = await findActivationKey(db, 'activation-key');
        expect(user).toMatchObject({
            username: 'testuser',
        });
    });

    it('should return undefined if activation key not found', async () => {
        const user = await findActivationKey(db, 'wrong-key');
        expect(user).toBeUndefined();
    });

    it('should update activation key', async () => {
        await updateActivationKey(db, utils, userId);
        const user = await getUserById(db, userId);
        expect(user).toMatchObject({
            activated: 1,
            activation_key: '',
        });
    });

    it('should get user by id', async () => {
        const user = await getUserById(db, userId);
        expect(user).toMatchObject({
            username: 'testuser',
        });
    });

    it('should return undefined if user id not found', async () => {
        const user = await getUserById(db, 9999);
        expect(user).toBeUndefined();
    });

    it('should get user count', async () => {
        const count = await getUserCount(db);
        expect(count[0].count).toBe(1);
    });

    it('should create new user', async () => {
        const newUser = {
            username: 'newuser',
            password: 'newPassword',
            email: 'blah@example.com',
            admin: false,
            avatar: null,
            activated: false,
            activation_key: 'new-activation-key',
            banned: false,
        };

        const createdUser = await createNewUser(db, utils, newUser);
        expect(createdUser).toMatchObject({
            username: 'newuser',
        });

        const fetchedUser = await db('User').where({ username: 'newuser' }).first();
        expect(fetchedUser).toMatchObject({
            username: 'newuser',
        });
    });

    it('should update user avatar', async () => {
        // Insert a media entry
        await db('Media').insert({
            title: 'Test Image',
            url: 'https://example.com/test-image.jpg',
            filename: "test-image",
            user_extension: 'jpg',
            mimetypeId: 1,
            userId: userId,
            adminOnly: false,
            filesize: 1000,
            uploaded: true,
            created: now,
            updated: now,
        });

        const media = await db('Media').where({ title: 'Test Image' }).first();
        const mediaId = media.id;

        await updateUserAvatar(db, utils, userId, mediaId);
        const user = await getUserById(db, userId);
        expect(user).toMatchObject({
            avatar: mediaId,
        });
    });
});
