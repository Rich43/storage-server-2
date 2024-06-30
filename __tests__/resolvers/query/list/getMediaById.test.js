import getMediaById from '../../../../src/resolvers/query/list/getMediaById.js';
import { getUserFromToken, validateToken } from '../../../../src/resolvers/utils/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../../src/resolvers/utils/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    join: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn()
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1,
    admin: false
}));

describe('getMediaById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully retrieve media by ID', async () => {
        const media = {
            id: 1,
            title: 'Test Media',
            description: 'Test description',
            url: 'http://example.com/media',
            mimetypeId: 1,
            mimetype: 'image/png',
            adminOnly: false
        };

        getUserFromToken.mockResolvedValueOnce({ id: 1, admin: false });
        mockDb.first.mockResolvedValueOnce(media);

        const result = await getMediaById(null, { id: 1 }, { db: mockDb, token: 'mock-token' });

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id');
        expect(mockDb.select).toHaveBeenCalledWith('Media.*', 'Mimetype.type as mimetype');
        expect(mockDb.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockDb.first).toHaveBeenCalled();
        expect(result).toEqual(media);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(getMediaById(null, { id: 1 }, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(mockDb.join).not.toHaveBeenCalled();
        expect(mockDb.select).not.toHaveBeenCalled();
        expect(mockDb.where).not.toHaveBeenCalled();
        expect(mockDb.first).not.toHaveBeenCalled();
    });

    it('should throw an error if the media is not found', async () => {
        mockDb.first.mockResolvedValueOnce(null);

        await expect(getMediaById(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Media not found');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id');
        expect(mockDb.select).toHaveBeenCalledWith('Media.*', 'Mimetype.type as mimetype');
        expect(mockDb.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockDb.first).toHaveBeenCalled();
    });

    it('should throw an error if the user does not have permission to view the media', async () => {
        const media = {
            id: 1,
            title: 'Test Media',
            description: 'Test description',
            url: 'http://example.com/media',
            mimetypeId: 1,
            mimetype: 'image/png',
            adminOnly: true
        };

        getUserFromToken.mockResolvedValueOnce({ id: 1, admin: false });
        mockDb.first.mockResolvedValueOnce(media);

        await expect(getMediaById(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('You do not have permission to view this media');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id');
        expect(mockDb.select).toHaveBeenCalledWith('Media.*', 'Mimetype.type as mimetype');
        expect(mockDb.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockDb.first).toHaveBeenCalled();
    });

    it('should throw an error if there is an unexpected error during media retrieval', async () => {
        getUserFromToken.mockResolvedValueOnce({ id: 1, admin: false });
        mockDb.first.mockRejectedValueOnce(new Error('Database error'));

        await expect(getMediaById(null, { id: 1 }, { db: mockDb, token: 'mock-token' }))
            .rejects
            .toThrow('Database error');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, 'mock-token');
        expect(mockDb.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id');
        expect(mockDb.select).toHaveBeenCalledWith('Media.*', 'Mimetype.type as mimetype');
        expect(mockDb.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockDb.first).toHaveBeenCalled();
    });
});
