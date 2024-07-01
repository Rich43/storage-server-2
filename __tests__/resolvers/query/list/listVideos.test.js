import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listVideos from '../../../../src/resolvers/query/list/listVideos';
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

    expect(mockValidateToken).toHaveBeenCalledWith(db, token);
    expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
    expect(mockGetMediaQuery).toHaveBeenCalledWith(db, expect.any(Object), 'VIDEO');
    expect(mockPerformFilter).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformPagination).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformSorting).toHaveBeenCalledWith(expect.anything(), expect.anything());
};

describe('listVideos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list videos successfully for a user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Video 1' }];

        setupMocks(user, mediaQuery);

        const result = listVideos(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list videos with applied filters', async () => {
        const filter = { name: 'Video 1' };
        const pagination = {};
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Video 1' }];

        setupMocks(user, mediaQuery);

        const result = listVideos(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list videos with pagination', async () => {
        const filter = {};
        const pagination = { limit: 10, offset: 0 };
        const sorting = {};
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Video 1' }];

        setupMocks(user, mediaQuery);

        const result = listVideos(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });

    it('should list videos with sorting', async () => {
        const filter = {};
        const pagination = {};
        const sorting = { field: 'name', direction: 'asc' };
        const user = { id: 1, admin: false };
        const mediaQuery = [{ id: 1, name: 'Video 1' }];

        setupMocks(user, mediaQuery);

        const result = listVideos(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, mediaQuery);
    });
});
