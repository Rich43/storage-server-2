import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listMedia from '../../../../src/resolvers/query/list/listMedia';

const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockSelect = jest.fn();
const mockGetMediaQuery = jest.fn();

const db = {};
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Media: {
        getMediaQuery: mockGetMediaQuery,
    },
};
const utils = {
    performFilter: jest.fn((filter, query) => query),
    performPagination: jest.fn((pagination, query) => query),
    performSorting: jest.fn((sorting, query) => query),
};
const token = 'mock-token';

describe('listMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock the `getMediaQuery` to return an object with `select` function
        mockGetMediaQuery.mockReturnValue({
            select: mockSelect,
        });
    });

    it('should list all media with filtering, pagination, and sorting', async () => {
        const filter = { title: 'example' };
        const pagination = { page: 1, limit: 10 };
        const sorting = { field: 'title', order: 'asc' };
        const user = { id: 1, admin: false };
        const media = [{ id: 1, title: 'example', mimetype: 'image/jpeg' }];

        // Mock token validation and user retrieval
        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);

        // Mock `select` to resolve the media results
        mockSelect.mockResolvedValue(media);

        const result = await listMedia(null, { filter, pagination, sorting }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(utils.performFilter).toHaveBeenCalledWith(filter, expect.any(Object));
        expect(utils.performPagination).toHaveBeenCalledWith(pagination, expect.any(Object));
        expect(utils.performSorting).toHaveBeenCalledWith(sorting, expect.any(Object));
        expect(result).toEqual(media);
    });

    it('should handle no media results', async () => {
        const filter = {};
        const pagination = { page: 1, limit: 10 };
        const sorting = { field: 'title', order: 'asc' };
        const user = { id: 1, admin: false };

        // Mock token validation and user retrieval
        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);

        // Mock `select` to resolve an empty array
        mockSelect.mockResolvedValue([]);

        const result = await listMedia(null, { filter, pagination, sorting }, { db, model, utils, token });

        expect(result).toEqual([]);
    });

    it('should throw an error if token validation fails', async () => {
        mockValidateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(listMedia(null, {}, { db, model, utils, token })).rejects.toThrow('Invalid token');
    });
});
