import createMediaComment from '../../../src/resolvers/mutation/createMediaComment.js';
import { getUserFromToken, validateToken } from '../../../src/resolvers/utils/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../src/resolvers/utils/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1
}));

describe('createMediaComment', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully create a media comment', async () => {
        const input = {
            mediaId: 1,
            comment: 'This is a test comment.'
        };

        const user = {
            id: 1
        };

        const newComment = {
            id: 1,
            media_id: 1,
            user_id: 1,
            comment: 'This is a test comment.',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z'
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.returning.mockResolvedValueOnce([newComment]);

        const result = await createMediaComment(null, { input }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.insert).toHaveBeenCalledWith({
            media_id: 1,
            user_id: 1,
            comment: 'This is a test comment.',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z'
        });
        expect(mockDb.returning).toHaveBeenCalledWith('*');
        expect(result).toEqual(newComment);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        const input = {
            mediaId: 1,
            comment: 'This is a test comment.'
        };

        await expect(createMediaComment(null, { input }, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it('should throw an error if comment creation fails', async () => {
        const input = {
            mediaId: 1,
            comment: 'This is a test comment.'
        };

        getUserFromToken.mockResolvedValueOnce({ id: 1 });
        mockDb.insert.mockRejectedValueOnce(new Error('Database error'));

        await expect(createMediaComment(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.insert).toHaveBeenCalled();
    });
});
