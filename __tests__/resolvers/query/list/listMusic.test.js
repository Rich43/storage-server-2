import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listMusic from '../../../../src/resolvers/query/list/listMusic';
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
    expect(mockGetMediaQuery).toHaveBeenCalledWith(db, expect.any(Object), 'AUDIO');
    expect(mockPerformFilter).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformPagination).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformSorting).toHaveBeenCalledWith(expect.anything(), expect.anything());
};

describe('listMusic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list music successfully for a user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Song 1' }];

        setupMocks(user, mediaQuery);

        const result = listMusic(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list music with applied filters', async () => {
        const filter = { name: 'Song 1' };
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Song 1' }];

        setupMocks(user, mediaQuery);

        const result = listMusic(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list music with pagination', async () => {
        const filter = {};
        const pagination = { limit: 10, offset: 0 };
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Song 1' }];

        setupMocks(user, mediaQuery);

        const result = listMusic(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list music with sorting', async () => {
        const filter = {};
        const pagination = {};
        const sorting = { field: 'name', direction: 'asc' };
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Song 1' }];

        setupMocks(user, mediaQuery);

        const result = listMusic(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });
});
