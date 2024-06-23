import listPictures from '../../../../src/resolvers/query/list/listPictures.js';
import {
    getMediaQuery,
    getUserFromToken,
    performFilter,
    performPagination,
    performSorting,
    validateToken
} from '../../../../src/resolvers/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../../../src/resolvers/utils.js');
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

describe('listPictures', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully list pictures', async () => {
        const token = 'mock-token';

        const pictures = [
            { id: 1, title: 'Picture 1', mimetype: 'image/jpeg' },
            { id: 2, title: 'Picture 2', mimetype: 'image/png' }
        ];

        mockDb.select.mockResolvedValueOnce(pictures);

        const result = await listPictures(null, {}, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'IMAGE');
        expect(performFilter).toHaveBeenCalledWith(undefined, mockDb);
        expect(performPagination).toHaveBeenCalledWith(undefined, mockDb);
        expect(performSorting).toHaveBeenCalledWith(undefined, mockDb);
        expect(result).toEqual(pictures);
    });

    it('should throw an error if the token is invalid', async () => {
        validateToken.mockRejectedValueOnce(new Error('Invalid token'));

        await expect(listPictures(null, {}, { db: mockDb, token: 'invalid-token' }))
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

        const filter = { title: 'Picture' };

        const pictures = [
            { id: 1, title: 'Picture 1', mimetype: 'image/jpeg' },
            { id: 2, title: 'Picture 2', mimetype: 'image/png' }
        ];

        mockDb.select.mockResolvedValueOnce(pictures);

        const result = await listPictures(null, { filter }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'IMAGE');
        expect(performFilter).toHaveBeenCalledWith(filter, mockDb);
        expect(performPagination).toHaveBeenCalledWith(undefined, mockDb);
        expect(performSorting).toHaveBeenCalledWith(undefined, mockDb);
        expect(result).toEqual(pictures);
    });

    it('should apply pagination correctly', async () => {
        const token = 'mock-token';

        const pagination = { page: 1, limit: 10 };

        const pictures = [
            { id: 1, title: 'Picture 1', mimetype: 'image/jpeg' },
            { id: 2, title: 'Picture 2', mimetype: 'image/png' }
        ];

        mockDb.select.mockResolvedValueOnce(pictures);

        const result = await listPictures(null, { pagination }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'IMAGE');
        expect(performFilter).toHaveBeenCalledWith(undefined, mockDb);
        expect(performPagination).toHaveBeenCalledWith(pagination, mockDb);
        expect(performSorting).toHaveBeenCalledWith(undefined, mockDb);
        expect(result).toEqual(pictures);
    });

    it('should apply sorting correctly', async () => {
        const token = 'mock-token';

        const sorting = { field: 'title', order: 'asc' };

        const pictures = [
            { id: 1, title: 'Picture 1', mimetype: 'image/jpeg' },
            { id: 2, title: 'Picture 2', mimetype: 'image/png' }
        ];

        mockDb.select.mockResolvedValueOnce(pictures);

        const result = await listPictures(null, { sorting }, { db: mockDb, token });

        expect(validateToken).toHaveBeenCalledWith(mockDb, token);
        expect(getUserFromToken).toHaveBeenCalledWith(mockDb, token);
        expect(getMediaQuery).toHaveBeenCalledWith(mockDb, { id: 1, admin: false }, 'IMAGE');
        expect(performFilter).toHaveBeenCalledWith(undefined, mockDb);
        expect(performPagination).toHaveBeenCalledWith(undefined, mockDb);
        expect(performSorting).toHaveBeenCalledWith(sorting, mockDb);
        expect(result).toEqual(pictures);
    });
});
