import deleteMediaComment from '../../../src/resolvers/mutation/deleteMediaComment.js';
import { getUserFromToken, validateToken } from '../../../src/resolvers/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../src/resolvers/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    del: jest.fn()
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1,
    admin: false
}));

describe('deleteMediaComment', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully delete a media comment', async () => {
        const comment = {
            id: 1,
            user_id: 1
        };

        mockDb.first.mockResolvedValueOnce(comment).mockResolvedValueOnce(null);
        mockDb.del.mockResolvedValueOnce(1);

        const result = await deleteMediaComment(null, { id: 1 }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(deleteMediaComment(null, { id: 1 }, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(mockDb.where).not.toHaveBeenCalled();
    });

    it('should throw an error if the comment is not found', async () => {
        mockDb.first.mockResolvedValueOnce(null);

        await expect(deleteMediaComment(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Comment not found');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is not authorized to delete the comment', async () => {
        const comment = {
            id: 1,
            user_id: 2 // Different user ID
        };

        mockDb.first.mockResolvedValueOnce(comment);

        await expect(deleteMediaComment(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Not authorized to delete this comment');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).not.toHaveBeenCalled();
    });

    it('should throw an error if comment deletion fails', async () => {
        const comment = {
            id: 1,
            user_id: 1
        };

        mockDb.first.mockResolvedValueOnce(comment);
        mockDb.del.mockRejectedValueOnce(new Error('Database error'));

        await expect(deleteMediaComment(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).toHaveBeenCalled();
    });
});
