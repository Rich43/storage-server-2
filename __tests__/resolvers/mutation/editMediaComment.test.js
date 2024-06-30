import editMediaComment from '../../../src/resolvers/mutation/editMediaComment.js';
import { getUserFromToken, validateToken } from '../../../src/resolvers/utils/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../../src/utils.js');
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
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1
}));

describe('editMediaComment', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully edit a media comment', async () => {
        const input = {
            id: 1,
            comment: 'This is an updated comment.'
        };

        const user = {
            id: 1
        };

        const existingComment = {
            id: 1,
            user_id: 1,
            comment: 'This is a test comment.',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z'
        };

        const updatedComment = {
            id: 1,
            user_id: 1,
            comment: 'This is an updated comment.',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z'
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.first.mockResolvedValueOnce(existingComment).mockResolvedValueOnce(updatedComment);

        const result = await editMediaComment(null, { input }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.update).toHaveBeenCalledWith({
            comment: 'This is an updated comment.',
            updated: '2024-01-01T00:00:00Z'
        });
        expect(result).toEqual(updatedComment);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        const input = {
            id: 1,
            comment: 'This is an updated comment.'
        };

        await expect(editMediaComment(null, { input }, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(mockDb.where).not.toHaveBeenCalled();
    });

    it('should throw an error if the comment is not found', async () => {
        mockDb.first.mockResolvedValueOnce(null);

        const input = {
            id: 1,
            comment: 'This is an updated comment.'
        };

        await expect(editMediaComment(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Comment not found');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is not authorized to edit the comment', async () => {
        const input = {
            id: 1,
            comment: 'This is an updated comment.'
        };

        const user = {
            id: 1
        };

        const existingComment = {
            id: 1,
            user_id: 2, // Different user ID
            comment: 'This is a test comment.',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z'
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.first.mockResolvedValueOnce(existingComment);

        await expect(editMediaComment(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Not authorized to edit this comment');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the comment update fails', async () => {
        const input = {
            id: 1,
            comment: 'This is an updated comment.'
        };

        const user = {
            id: 1
        };

        const existingComment = {
            id: 1,
            user_id: 1,
            comment: 'This is a test comment.',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z'
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.first.mockResolvedValueOnce(existingComment);
        mockDb.update.mockRejectedValueOnce(new Error('Database error'));

        await expect(editMediaComment(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.update).toHaveBeenCalled();
    });
});
