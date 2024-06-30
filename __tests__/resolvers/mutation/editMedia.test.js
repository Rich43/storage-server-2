import editMedia from '../../../src/resolvers/mutation/editMedia.js';
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
    select: jest.fn().mockReturnThis(),
    update: jest.fn(),
    returning: jest.fn().mockReturnThis(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1,
    admin: false
}));

describe('editMedia', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully edit media', async () => {
        const input = {
            id: 1,
            title: 'Updated Title',
            description: 'Updated description',
            url: 'http://example.com/media',
            mimetype: 'image/png',
            thumbnail: 'http://example.com/thumbnail.png',
            adminOnly: false
        };

        const user = {
            id: 1,
            admin: false
        };

        const media = {
            id: 1,
            userId: 1,
            title: 'Original Title',
            description: 'Original description',
            url: 'http://example.com/original_media',
            mimetype_id: 1,
            thumbnail: 'http://example.com/original_thumbnail.png',
            adminOnly: false
        };

        const mimetypeId = { id: 1 };
        const updatedMedia = {
            id: 1,
            title: 'Updated Title',
            description: 'Updated description',
            url: 'http://example.com/media',
            mimetype_id: 1,
            thumbnail: 'http://example.com/thumbnail.png',
            adminOnly: false,
            updated: '2024-01-01T00:00:00Z'
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.first.mockResolvedValueOnce(media).mockResolvedValueOnce(updatedMedia);
        mockDb.select.mockResolvedValueOnce(mimetypeId);

        const result = await editMedia(null, { input }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.select).toHaveBeenCalledWith('id');
        expect(mockDb.update).toHaveBeenCalledWith({
            title: 'Updated Title',
            description: 'Updated description',
            url: 'http://example.com/media',
            mimetype_id: 1,
            thumbnail: 'http://example.com/thumbnail.png',
            updated: '2024-01-01T00:00:00Z'
        });
        expect(result).toEqual(updatedMedia);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        const input = {
            id: 1,
            title: 'Updated Title'
        };

        await expect(editMedia(null, { input }, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(mockDb.where).not.toHaveBeenCalled();
        expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('should throw an error if media is not found', async () => {
        mockDb.first.mockResolvedValueOnce(null);

        const input = {
            id: 1,
            title: 'Updated Title'
        };

        await expect(editMedia(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Media not found');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the media update fails', async () => {
        const input = {
            id: 1,
            title: 'Updated Title'
        };

        const user = {
            id: 1,
            admin: false
        };

        const media = {
            id: 1,
            userId: 1,
            title: 'Original Title',
            description: 'Original description',
            url: 'http://example.com/original_media',
            mimetype_id: 1,
            thumbnail: 'http://example.com/original_thumbnail.png',
            adminOnly: false
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.first.mockResolvedValueOnce(media);
        mockDb.update.mockRejectedValueOnce(new Error('Database error'));

        await expect(editMedia(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.where).toHaveBeenCalledWith('id', 1);
        expect(mockDb.update).toHaveBeenCalled();
    });
});
