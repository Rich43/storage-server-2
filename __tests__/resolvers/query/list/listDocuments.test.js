import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listDocuments from '../../../../src/resolvers/query/list/listDocuments';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaQuery = jest.fn();
const mockPerformFilter = jest.fn();
const mockPerformPagination = jest.fn();
const mockPerformSorting = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Media: {
        getMediaQuery: mockGetMediaQuery,
    }
};
const utils = {
    performFilter: mockPerformFilter,
    performPagination: mockPerformPagination,
    performSorting: mockPerformSorting,
};
const token = 'mock-token'; // Mock token object

const setupMocks = (user, mediaQuery) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaQuery.mockReturnValue(mediaQuery);
    mockPerformFilter.mockImplementation((filter, query) => query);
    mockPerformPagination.mockImplementation((pagination, query) => query);
    mockPerformSorting.mockImplementation((sorting, query) => query);
};

const assertCommonMocks = async (result, expectedQuery) => {
    await expect(result).resolves.toEqual(expectedQuery);

    expect(mockValidateToken).toHaveBeenCalledWith(db, token);
    expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
    expect(mockGetMediaQuery).toHaveBeenCalledWith(db, expect.any(Object), 'DOCUMENT');
    expect(mockPerformFilter).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformPagination).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformSorting).toHaveBeenCalledWith(expect.anything(), expect.anything());
};

describe('listDocuments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list documents successfully for a user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Document 1' }];

        setupMocks(user, mediaQuery);

        const result = listDocuments(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list documents with applied filters', async () => {
        const filter = { name: 'Document 1' };
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Document 1' }];

        setupMocks(user, mediaQuery);

        const result = listDocuments(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list documents with pagination', async () => {
        const filter = {};
        const pagination = { limit: 10, offset: 0 };
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Document 1' }];

        setupMocks(user, mediaQuery);

        const result = listDocuments(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list documents with sorting', async () => {
        const filter = {};
        const pagination = {};
        const sorting = { field: 'name', direction: 'asc' };
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Document 1' }];

        setupMocks(user, mediaQuery);

        const result = listDocuments(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });
});
