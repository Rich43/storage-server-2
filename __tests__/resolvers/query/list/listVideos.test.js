import listVideos from '../../../../src/resolvers/query/list/listVideos.js';
import {
    getMediaQuery,
    getUserFromToken,
    performFilter,
    performPagination,
    performSorting,
    validateToken
} from '../../../../src/resolvers/utils/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../../src/resolvers/utils/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis()
};

// Mock functions
validateToken.mockImplementation(async (db, token) => true);
getUserFromToken.mockImplementation(async (db, token) => ({
    id: 1,
    admin: false
}));
getMediaQuery.mockImplementation((db, user, category) => mockDb);
performFilter.mockImplementation((filter, query) => query);
performPagination.mockImplementation((pagination, query) => query);
performSorting.mockImplementation((sorting, query) => query);

describe('listVideos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully list videos', async () => {
        const token = 'mock-token';

        const videos = [
            { id: 1, title: 'Video 1', mimetype: 'video/mp4' },
            { id: 2, title: 'Video 2', mimetype: 'video/mp4' }
        ];

        mockDb.select.mockResolvedValueOnce(videos);

        const result = await listVideos(null, {}, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'VIDEO');
        expect(performFilter).toHaveBeenCalledWith(undefined, mockDb);
        expect(performPagination).toHaveBeenCalledWith(undefined, mockDb);
        expect(performSorting).toHaveBeenCalledWith(undefined, mockDb);
        expect(result).toEqual(videos);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(listVideos(null, {}, { db: mockDb, token: 'invalid-token' }))
            .rejects
            .toThrow('Invalid token');

        expect(validateToken).toHaveBeenCalledWith(mockDb, 'invalid-token');
        expect(getUserFromToken).not.toHaveBeenCalled();
        expect(getMediaQuery).not.toHaveBeenCalled();
        expect(performFilter).not.toHaveBeenCalled();
        expect(performPagination).not.toHaveBeenCalled();
        expect(performSorting).not.toHaveBeenCalled();
    });

    it('should apply filters correctly', async () => {
        const token = 'mock-token';

        const filter = { title: 'Video' };

        const videos = [
            { id: 1, title: 'Video 1', mimetype: 'video/mp4' },
            { id: 2, title: 'Video 2', mimetype: 'video/mp4' }
        ];

        mockDb.select.mockResolvedValueOnce(videos);

        const result = await listVideos(null, { filter }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'VIDEO');
        expect(performFilter).toHaveBeenCalledWith(filter, mockDb);
        expect(performPagination).toHaveBeenCalledWith(undefined, mockDb);
        expect(performSorting).toHaveBeenCalledWith(undefined, mockDb);
        expect(result).toEqual(videos);
    });

    it('should apply pagination correctly', async () => {
        const token = 'mock-token';

        const pagination = { page: 1, limit: 10 };

        const videos = [
            { id: 1, title: 'Video 1', mimetype: 'video/mp4' },
            { id: 2, title: 'Video 2', mimetype: 'video/mp4' }
        ];

        mockDb.select.mockResolvedValueOnce(videos);

        const result = await listVideos(null, { pagination }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'VIDEO');
        expect(performFilter).toHaveBeenCalledWith(undefined, mockDb);
        expect(performPagination).toHaveBeenCalledWith(pagination, mockDb);
        expect(performSorting).toHaveBeenCalledWith(undefined, mockDb);
        expect(result).toEqual(videos);
    });

    it('should apply sorting correctly', async () => {
        const token = 'mock-token';

        const sorting = { field: 'title', order: 'asc' };

        const videos = [
            { id: 1, title: 'Video 1', mimetype: 'video/mp4' },
            { id: 2, title: 'Video 2', mimetype: 'video/mp4' }
        ];

        mockDb.select.mockResolvedValueOnce(videos);

        const result = await listVideos(null, { sorting }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'VIDEO');
        expect(performFilter).toHaveBeenCalledWith(undefined, mockDb);
        expect(performPagination).toHaveBeenCalledWith(undefined, mockDb);
        expect(performSorting).toHaveBeenCalledWith(sorting, mockDb);
        expect(result).toEqual(videos);
    });
});
