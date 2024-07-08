import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listDocuments from '../../../../src/resolvers/query/list/listDocuments';
import {
    db,
    mockGetMediaQuery,
    mockGetUserFromToken,
    mockPerformFilter,
    mockPerformPagination,
    mockPerformSorting,
    mockValidateToken,
    model,
    setupMocks,
    token,
    utils
} from '../../commonMocks.js';

const assertCommonMocks = async (result, expectedQuery, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(expectedQuery);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
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
        const filter = { name: 'Document' };
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
        const sorting = { field: 'name', order: 'asc' };
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Document 1' }];

        setupMocks(user, mediaQuery);

        const result = listDocuments(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });
});
