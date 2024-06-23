import refreshSession from '../../../../src/resolvers/mutation/auth/refreshSession.js';
import { v4 as uuidv4 } from 'uuid';
import { getDates, validateToken } from '../../../../src/resolvers/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('uuid');
jest.mock('../../../../src/resolvers/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    update: jest.fn(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

// Mock functions
uuidv4.mockReturnValue('new-mock-session-token');
getDates.mockReturnValue({
    sessionExpireDateTime: '2024-01-01T00:00:00Z',
    sessionExpireDateTimeFormatted: '2024-01-01 00:00:00'
});
validateToken.mockImplementation(async (db, token) => ({
    id: 1,
    userId: 1,
    sessionToken: token
}));

describe('refreshSession', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully refresh the session', async () => {
        const session = {
            id: 1,
            userId: 1,
            sessionToken: 'mock-token'
        };

        const user = {
            id: 1,
            username: 'testuser',
            avatar: 'avatar.png',
            admin: false
        };

        validateToken.mockResolvedValueOnce(session);
        mockDb.first.mockResolvedValueOnce(user);

        const result = await refreshSession(null, null, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith({ sessionToken: 'mock-token' });
        expect(mockDb.update).toHaveBeenCalledWith({
            sessionToken: 'new-mock-session-token',
            sessionExpireDateTime: '2024-01-01 00:00:00',
            updated: '2024-01-01T00:00:00Z'
        });
        expect(mockDb.first).toHaveBeenCalledWith({ id: 1 });

        expect(result).toEqual({
            userId: user.id,
            sessionId: session.id,
            username: user.username,
            avatarPicture: user.avatar,
            sessionToken: 'new-mock-session-token',
            sessionExpireDateTime: '2024-01-01T00:00:00Z',
            admin: user.admin
        });
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(refreshSession(null, null, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('should throw an error if session update fails', async () => {
        const session = {
            id: 1,
            userId: 1,
            sessionToken: 'mock-token'
        };

        validateToken.mockResolvedValueOnce(session);
        mockDb.update.mockRejectedValueOnce(new Error('Database error'));

        await expect(refreshSession(null, null, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.update).toHaveBeenCalled();
        expect(mockDb.first).not.toHaveBeenCalled();
    });
});
