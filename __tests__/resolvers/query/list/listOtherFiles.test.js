import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listOtherFiles from '../../../../src/resolvers/query/list/listOtherFiles';
import {
    db,
    model,
    utils,
    token,
    setupMocks,
    mockValidateToken,
    mockGetUserFromToken,
    mockGetMediaQuery,
    mockPerformFilter,
    mockPerformPagination,
    mockPerformSorting,
} from './commonMocks'; // Adjust the path as necessary

const assertCommonMocks = async (result, expectedQuery) => {
    await expect(result).resolves.toEqual(expectedQuery);

    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
    expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
    expect(mockGetMediaQuery).toHaveBeenCalledWith(db, expect.any(Object), 'OTHER');
    expect(mockPerformFilter).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformPagination).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformSorting).toHaveBeenCalledWith(expect.anything(), expect.anything());
};

describe('listOtherFiles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list other files successfully for a user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'File 1' }];

        setupMocks(user, mediaQuery);

        const result = listOtherFiles(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list other files with applied filters', async () => {
        const filter = { name: 'File 1' };
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'File 1' }];

        setupMocks(user, mediaQuery);

        const result = listOtherFiles(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list other files with pagination', async () => {
        const filter = {};
        const pagination = { limit: 10, offset: 0 };
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'File 1' }];

        setupMocks(user, mediaQuery);

        const result = listOtherFiles(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list other files with sorting', async () => {
        const filter = {};
        const pagination = {};
        const sorting = { field: 'name', direction: 'asc' };
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'File 1' }];

        setupMocks(user, mediaQuery);

        const result = listOtherFiles(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });
});
