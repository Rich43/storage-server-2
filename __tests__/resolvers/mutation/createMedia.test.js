import createMedia from '../../../src/resolvers/mutation/createMedia.js';
import { getUserFromToken, validateToken } from '../../../src/resolvers/utils/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../src/resolvers/utils/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    returning: jest.fn().mockReturnThis()
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    userId: 1,
    admin: false
}));

describe('createMedia', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully create media', async () => {
        const input = {
            title: 'Test Media',
            description: 'Test description',
            url: 'http://example.com/media',
            mimetype: 'image/png',
            thumbnail: 'http://example.com/thumbnail.png',
            adminOnly: false
        };

        const user = {
            userId: 1,
            admin: false
        };

        const mimetypeId = { id: 1 };
        const mediaId = [1];
        const media = {
            id: 1,
            title: 'Test Media',
            description: 'Test description',
            url: 'http://example.com/media',
            mimetypeId: 1,
            thumbnail: 'http://example.com/thumbnail.png',
            userId: 1,
            adminOnly: false
        };

        getUserFromToken.mockResolvedValueOnce(user);
        mockDb.select.mockResolvedValueOnce(mimetypeId);
        mockDb.returning.mockResolvedValueOnce(mediaId);
        mockDb.first.mockResolvedValueOnce(media);

        const result = await createMedia(null, { input }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.select).toHaveBeenCalledWith('id');
        expect(mockDb.where).toHaveBeenCalledWith('type', 'image/png');
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.insert).toHaveBeenCalledWith({
            title: 'Test Media',
            description: 'Test description',
            url: 'http://example.com/media',
            mimetypeId: 1,
            thumbnail: 'http://example.com/thumbnail.png',
            userId: 1,
            adminOnly: false
        });
        expect(mockDb.returning).toHaveBeenCalledWith('id');
        expect(result).toEqual(media);
    });

    it('should set adminOnly to true only if the user is admin', async () => {
        const input = {
            title: 'Admin Media',
            description: 'Admin description',
            url: 'http://example.com/media',
            mimetype: 'image/png',
            thumbnail: 'http://example.com/thumbnail.png',
            adminOnly: true
        };

        const adminUser = {
            userId: 1,
            admin: true
        };

        const mimetypeId = { id: 1 };
        const mediaId = [1];
        const media = {
            id: 1,
            title: 'Admin Media',
            description: 'Admin description',
            url: 'http://example.com/media',
            mimetypeId: 1,
            thumbnail: 'http://example.com/thumbnail.png',
            userId: 1,
            adminOnly: true
        };

        getUserFromToken.mockResolvedValueOnce(adminUser);
        mockDb.select.mockResolvedValueOnce(mimetypeId);
        mockDb.returning.mockResolvedValueOnce(mediaId);
        mockDb.first.mockResolvedValueOnce(media);

        const result = await createMedia(null, { input }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.select).toHaveBeenCalledWith('id');
        expect(mockDb.where).toHaveBeenCalledWith('type', 'image/png');
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.insert).toHaveBeenCalledWith({
            title: 'Admin Media',
            description: 'Admin description',
            url: 'http://example.com/media',
            mimetypeId: 1,
            thumbnail: 'http://example.com/thumbnail.png',
            userId: 1,
            adminOnly: true
        });
        expect(mockDb.returning).toHaveBeenCalledWith('id');
        expect(result).toEqual(media);
    });

    it('should throw an error if the media creation fails', async () => {
        const input = {
            title: 'Error Media',
            description: 'Error description',
            url: 'http://example.com/media',
            mimetype: 'image/png',
            thumbnail: 'http://example.com/thumbnail.png',
            adminOnly: false
        };

        getUserFromToken.mockResolvedValueOnce({ userId: 1, admin: false });
        mockDb.insert.mockRejectedValueOnce(new Error('Database error'));

        await expect(createMedia(null, { input }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.insert).toHaveBeenCalled();
    });
});
