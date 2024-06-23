import logoutUser from '../../../../src/resolvers/mutation/auth/logoutUser.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock knex
jest.mock('knex');
const mockDb = {
    where: jest.fn().mockReturnThis(),
    del: jest.fn()
};

knex.mockReturnValue(mockDb);

describe('logoutUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully log out the user', async () => {
        mockDb.del.mockResolvedValueOnce(1); // Simulate successful deletion

        const result = await logoutUser(null, null, { db: mockDb, token: 'mock-token' });

        expect(mockDb.where).toHaveBeenCalledWith({ sessionToken: 'mock-token' });
        expect(mockDb.del).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('should handle errors during logout', async () => {
        mockDb.del.mockRejectedValueOnce(new Error('Database error'));

        await expect(logoutUser(null, null, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(mockDb.where).toHaveBeenCalledWith({ sessionToken: 'mock-token' });
        expect(mockDb.del).toHaveBeenCalled();
    });
});
