import deleteMedia from '../../../src/resolvers/mutation/deleteMedia.js';
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
validateToken.mockImplementation(async (db, token) => ({
    userId: 1
}));
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1,
    admin: false
}));

describe('deleteMedia', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully delete media', async () => {
        const media = {
            id: 1,
            userId: 1,
            adminOnly: false
        };

        mockDb.first.mockResolvedValueOnce(media).mockResolvedValueOnce(null);
        mockDb.del.mockResolvedValueOnce(1);

        const result = await deleteMedia(null, { id: 1 }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(deleteMedia(null, { id: 1 }, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(mockDb.where).not.toHaveBeenCalled();
    });

    it('should throw an error if media is not found', async () => {
        mockDb.first.mockResolvedValueOnce(null);

        await expect(deleteMedia(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Media not found');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is not the owner of the media', async () => {
        const media = {
            id: 1,
            userId: 2, // Different user ID
            adminOnly: false
        };

        mockDb.first.mockResolvedValueOnce(media);

        await expect(deleteMedia(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('You can only delete your own media');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).not.toHaveBeenCalled();
    });

    it('should throw an error if the media is adminOnly and the user is not an admin', async () => {
        const media = {
            id: 1,
            userId: 1,
            adminOnly: true
        };

        const user = {
            id: 1,
            admin: false
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.first.mockResolvedValueOnce(media);

        await expect(deleteMedia(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Only admins can delete adminOnly media');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).not.toHaveBeenCalled();
    });

    it('should throw an error if media deletion fails', async () => {
        const media = {
            id: 1,
            userId: 1,
            adminOnly: false
        };

        mockDb.first.mockResolvedValueOnce(media);
        mockDb.del.mockRejectedValueOnce(new Error('Database error'));

        await expect(deleteMedia(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.del).toHaveBeenCalled();
    });
});
