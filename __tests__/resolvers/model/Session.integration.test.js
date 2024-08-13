import { cleanupDatabase, db, setupDatabase } from '../../../setupTestDatabase';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import {
    createSession,
    deleteSession,
    getAdminFlagFromSession,
    getSessionById,
    updateSessionWithNewTokenAndExpiryDate,
    validateToken
} from "../../../src/resolvers/model/Session.js";
import { __ALL__ as utils } from "../../../src/resolvers/utils/utils.js";

describe('Session management integration tests', () => {
    let userId;
    let sessionToken;
    let sessionExpireDateTimeFormatted;
    const now = utils.moment().utc().toISOString();

    beforeAll(async () => {
        await setupDatabase();
    });

    afterAll(async () => {
        await cleanupDatabase();
    });

    beforeEach(async () => {
        await db('User').insert({
            username: 'testuser',
            password: 'Password1',
            email: 'joe@example.com',
            created: now,
            updated: now,
            activation_key: '',
            admin: true
        });

        const user = await db('User').where({ username: 'testuser' }).first();
        userId = user.id;
        sessionToken = utils.uuidv4();
        sessionExpireDateTimeFormatted = utils.moment().add(1, 'hour').utc().toISOString();

        // Create a session for the user before each test
        await createSession(db, utils, userId, sessionToken, sessionExpireDateTimeFormatted);
    });

    afterEach(async () => {
        await db('Session').del();
        await db('User').del();
    });

    it('createSession', async () => {
        const newSessionToken = utils.uuidv4();
        const newSessionExpireDateTimeFormatted = utils.moment().add(1, 'hour').utc().toISOString();
        const sessionId = await createSession(db, utils, userId, newSessionToken, newSessionExpireDateTimeFormatted);
        expect(sessionId).toBeDefined();

        const session = await getSessionById(db, sessionId);
        expect(session).toMatchObject({
            userId,
            sessionToken: newSessionToken,
            sessionExpireDateTime: newSessionExpireDateTimeFormatted,
        });
    });

    it('validateToken', async () => {
        const session = await validateToken(db, utils, sessionToken);
        expect(session).toMatchObject({
            userId,
            sessionToken,
        });

        // Invalid token case
        const invalidToken = utils.uuidv4();
        await expect(validateToken(db, utils, invalidToken)).rejects.toThrow('Invalid session token');

        // Expired token case
        const expiredToken = utils.uuidv4();
        const expiredSessionExpireDateTimeFormatted = utils.moment().subtract(1, 'hour').utc().toISOString();
        await createSession(db, utils, userId, expiredToken, expiredSessionExpireDateTimeFormatted);
        await expect(validateToken(db, utils, expiredToken)).rejects.toThrow('Session token has expired');
    });

    it('updateSessionWithNewTokenAndExpiryDate', async () => {
        const newSessionToken = utils.uuidv4();
        const newSessionExpireDateTimeFormatted = utils.moment().add(2, 'hours').utc().toISOString();
        const updateCount = await updateSessionWithNewTokenAndExpiryDate(db, utils, sessionToken, newSessionToken, newSessionExpireDateTimeFormatted);
        expect(updateCount).toBe(1);

        const updatedSession = await validateToken(db, utils, newSessionToken);
        expect(updatedSession).toMatchObject({
            userId,
            sessionToken: newSessionToken,
            sessionExpireDateTime: newSessionExpireDateTimeFormatted,
        });

        // Ensure the old token is invalidated
        await expect(validateToken(db, utils, sessionToken)).rejects.toThrow('Invalid session token');

        sessionToken = newSessionToken; // Update the sessionToken for the next test
    });

    it('updateSessionWithNewTokenAndExpiryDate should fail if token not found', async () => {
        const newSessionToken = utils.uuidv4();
        const newSessionExpireDateTimeFormatted = utils.moment().add(2, 'hours').utc().toISOString();
        await expect(updateSessionWithNewTokenAndExpiryDate(db, utils, 'non-existing-token', newSessionToken, newSessionExpireDateTimeFormatted))
            .rejects
            .toThrow('Failed to update session token, original token not found');
    });

    it('getAdminFlagFromSession', async () => {
        const isAdmin = await getAdminFlagFromSession(db, sessionToken);
        expect(isAdmin).toBe(1);
    });

    it('getAdminFlagFromSession should fail if session or user not found', async () => {
        const invalidToken = utils.uuidv4();
        await expect(getAdminFlagFromSession(db, invalidToken)).rejects.toThrow('Session or user not found');
    });

    it('deleteSession', async () => {
        const deleteCount = await deleteSession(db, sessionToken);
        expect(deleteCount).toBe(1);

        await expect(validateToken(db, utils, sessionToken)).rejects.toThrow('Invalid session token');
    });

    it('deleteSession should fail if token not found', async () => {
        await expect(deleteSession(db, 'non-existing-token')).rejects.toThrow('Session token not found for deletion');
    });

    it('getSessionById should fail if session not found', async () => {
        const nonExistingSessionId = 9999; // Assuming this ID doesn't exist
        await expect(getSessionById(db, nonExistingSessionId)).rejects.toThrow('Session not found');
    });
});
