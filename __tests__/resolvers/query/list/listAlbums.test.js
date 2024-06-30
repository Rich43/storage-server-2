import listAlbums from '../../../../src/resolvers/query/list/listAlbums.js';
import { validateToken } from '../../../../src/resolvers/utils/utils.js';
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
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    first: jest.fn()
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);

describe('listAlbums', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully list albums with media', async () => {
        const token = 'mock-token';
        const userSession = { admin: false };

        const albums = [
            { id: 1, title: 'Album 1' },
            { id: 2, title: 'Album 2' }
        ];

        const media = [
            { id: 1, albumId: 1, adminOnly: false },
            { id: 2, albumId: 2, adminOnly: false }
        ];

        mockDb.first.mockResolvedValueOnce(userSession);
        mockDb.select.mockResolvedValueOnce(albums);
        mockDb.where.mockResolvedValueOnce(media).mockResolvedValueOnce(media);

        const result = await listAlbums(null, {}, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(mockDb.join).toHaveBeenCalledWith('User', 'Session.userId', 'User.id');
        expect(mockDb.select).toHaveBeenCalledWith('User.admin');
        expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
        expect(mockDb.select).toHaveBeenCalledWith('*');
        expect(result).toEqual([
            { id: 1, title: 'Album 1', media: media },
            { id: 2, title: 'Album 2', media: media }
        ]);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(listAlbums(null, {}, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(mockDb.join).not.toHaveBeenCalled();
        expect(mockDb.select).not.toHaveBeenCalled();
        expect(mockDb.where).not.toHaveBeenCalled();
    });

    it('should apply filters correctly', async () => {
        const token = 'mock-token';
        const userSession = { admin: false };

        const filter = {
            title: 'Album',
            userId: 1
        };

        const albums = [
            { id: 1, title: 'Album 1', userId: 1 },
            { id: 2, title: 'Album 2', userId: 1 }
        ];

        mockDb.first.mockResolvedValueOnce(userSession);
        mockDb.select.mockResolvedValueOnce(albums);

        const result = await listAlbums(null, { filter }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(mockDb.join).toHaveBeenCalledWith('User', 'Session.userId', 'User.id');
        expect(mockDb.select).toHaveBeenCalledWith('User.admin');
        expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
        expect(mockDb.select).toHaveBeenCalledWith('*');
        expect(mockDb.where).toHaveBeenCalledWith('Album.title', 'like', '%Album%');
        expect(mockDb.where).toHaveBeenCalledWith('Album.userId', 1);
        expect(result).toEqual([
            { id: 1, title: 'Album 1', userId: 1 },
            { id: 2, title: 'Album 2', userId: 1 }
        ]);
    });

    it('should apply pagination correctly', async () => {
        const token = 'mock-token';
        const userSession = { admin: false };

        const pagination = {
            page: 1,
            limit: 10
        };

        const albums = [
            { id: 1, title: 'Album 1' },
            { id: 2, title: 'Album 2' }
        ];

        mockDb.first.mockResolvedValueOnce(userSession);
        mockDb.select.mockResolvedValueOnce(albums);

        const result = await listAlbums(null, { pagination }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(mockDb.join).toHaveBeenCalledWith('User', 'Session.userId', 'User.id');
        expect(mockDb.select).toHaveBeenCalledWith('User.admin');
        expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
        expect(mockDb.select).toHaveBeenCalledWith('*');
        expect(mockDb.limit).toHaveBeenCalledWith(10);
        expect(mockDb.offset).toHaveBeenCalledWith(0);
        expect(result).toEqual(albums);
    });

    it('should apply sorting correctly', async () => {
        const token = 'mock-token';
        const userSession = { admin: false };

        const sorting = {
            field: 'title',
            order: 'asc'
        };

        const albums = [
            { id: 1, title: 'Album 1' },
            { id: 2, title: 'Album 2' }
        ];

        mockDb.first.mockResolvedValueOnce(userSession);
        mockDb.select.mockResolvedValueOnce(albums);

        const result = await listAlbums(null, { sorting }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(mockDb.join).toHaveBeenCalledWith('User', 'Session.userId', 'User.id');
        expect(mockDb.select).toHaveBeenCalledWith('User.admin');
        expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
        expect(mockDb.select).toHaveBeenCalledWith('*');
        expect(mockDb.orderBy).toHaveBeenCalledWith('title', 'asc');
        expect(result).toEqual(albums);
    });

    it('should return only non-admin media if the user is not an admin', async () => {
        const token = 'mock-token';
        const userSession = { admin: false };

        const albums = [
            { id: 1, title: 'Album 1' }
        ];

        const media = [
            { id: 1, albumId: 1, adminOnly: false }
        ];

        getUserFromToken.mockResolvedValueOnce(userSession);
        mockDb.first.mockResolvedValueOnce(userSession);
        mockDb.select.mockResolvedValueOnce(albums);
        mockDb.where.mockResolvedValueOnce(media);

        const result = await listAlbums(null, {}, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(mockDb.join).toHaveBeenCalledWith('User', 'Session.userId', 'User.id');
        expect(mockDb.select).toHaveBeenCalledWith('User.admin');
        expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
        expect(mockDb.select).toHaveBeenCalledWith('*');
        expect(mockDb.where).toHaveBeenCalledWith('Media.adminOnly', false);
        expect(result).toEqual([
            { id: 1, title: 'Album 1', media: media }
        ]);
    });

    it('should return all media if the user is an admin', async () => {
        const token = 'mock-token';
        const userSession = { admin: true };

        const albums = [
            { id: 1, title: 'Album 1' }
        ];

        const media = [
            { id: 1, albumId: 1, adminOnly: false },
            { id: 2, albumId: 1, adminOnly: true }
        ];

        getUserFromToken.mockResolvedValueOnce(userSession);
        mockDb.first.mockResolvedValueOnce(userSession);
        mockDb.select.mockResolvedValueOnce(albums);
        mockDb.where.mockResolvedValueOnce(media);

        const result = await listAlbums(null, {}, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(mockDb.join).toHaveBeenCalledWith('User', 'Session.userId', 'User.id');
        expect(mockDb.select).toHaveBeenCalledWith('User.admin');
        expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
        expect(mockDb.select).toHaveBeenCalledWith('*');
        expect(result).toEqual([
            { id: 1, title: 'Album 1', media: media }
        ]);
    });
});
