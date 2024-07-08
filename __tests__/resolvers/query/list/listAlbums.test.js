import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listAlbums from '../../../../src/resolvers/query/list/listAlbums';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetAdminFlagFromSession = jest.fn();
const mockGetAllAlbums = jest.fn();
const mockFilterAlbum = jest.fn();
const mockPerformPagination = jest.fn();
const mockPerformSorting = jest.fn();
const mockGetMediaByAlbumIdJoiningOnAlbumMediaAndMimetype = jest.fn();
const mockAddAdminOnlyRestriction = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
        getAdminFlagFromSession: mockGetAdminFlagFromSession,
    },
    Album: {
        getAllAlbums: mockGetAllAlbums,
        filterAlbum: mockFilterAlbum,
    },
    Media: {
        getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype: mockGetMediaByAlbumIdJoiningOnAlbumMediaAndMimetype,
        addAdminOnlyRestriction: mockAddAdminOnlyRestriction,
    }
};
const utils = {
    performPagination: mockPerformPagination,
    performSorting: mockPerformSorting,
};
const token = 'mock-token'; // Mock token object

const setupMocks = (isValidToken, isAdmin, albums, media) => {
    mockValidateToken.mockResolvedValue(isValidToken ? {} : Promise.reject(new Error('Invalid session token')));
    mockGetAdminFlagFromSession.mockResolvedValue(isAdmin);
    mockGetAllAlbums.mockResolvedValue(albums);
    mockFilterAlbum.mockImplementation((filter, query) => {
        if (filter === 'throwError') throw new Error('Filter error');
        return query;
    });
    mockPerformPagination.mockImplementation((pagination, query) => query);
    mockPerformSorting.mockImplementation((sorting, query) => query);
    mockGetMediaByAlbumIdJoiningOnAlbumMediaAndMimetype.mockResolvedValue(media);
    mockAddAdminOnlyRestriction.mockImplementation((isAdmin, query) => query);
};

const assertCommonMocks = async (result, albums, media, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(albums);
        for (const album of albums) {
            album.media = media;
        }
    }

    if (error === 'Invalid session token') {
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetAdminFlagFromSession).not.toHaveBeenCalled();
        expect(mockGetAllAlbums).not.toHaveBeenCalled();
        expect(mockFilterAlbum).not.toHaveBeenCalled();
        expect(mockPerformPagination).not.toHaveBeenCalled();
        expect(mockPerformSorting).not.toHaveBeenCalled();
    } else if (error === 'Filter error') {
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetAdminFlagFromSession).toHaveBeenCalledWith(db, token);
        expect(mockGetAllAlbums).toHaveBeenCalledWith(db);
        expect(mockFilterAlbum).toHaveBeenCalledWith('throwError', expect.anything());
        expect(mockPerformPagination).not.toHaveBeenCalled();
        expect(mockPerformSorting).not.toHaveBeenCalled();
    } else {
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetAdminFlagFromSession).toHaveBeenCalledWith(db, token);
        expect(mockGetAllAlbums).toHaveBeenCalledWith(db);
        expect(mockFilterAlbum).toHaveBeenCalledWith(expect.anything(), expect.anything());
        expect(mockPerformPagination).toHaveBeenCalledWith(expect.anything(), expect.anything());
        expect(mockPerformSorting).toHaveBeenCalledWith(expect.anything(), expect.anything());

        for (const album of albums) {
            expect(mockGetMediaByAlbumIdJoiningOnAlbumMediaAndMimetype).toHaveBeenCalledWith(db, album);
            expect(mockAddAdminOnlyRestriction).toHaveBeenCalledWith(expect.any(Boolean), expect.anything());
        }
    }
};

describe('listAlbums', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list albums successfully for a non-admin user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const isAdmin = false;
        const albums = [{ id: 1, name: 'Album 1' }];
        const media = [{ id: 1, albumId: 1, name: 'Media 1' }];

        setupMocks(true, isAdmin, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });

    it('should list albums successfully for an admin user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const isAdmin = true;
        const albums = [{ id: 1, name: 'Album 1' }];
        const media = [{ id: 1, albumId: 1, name: 'Media 1' }];

        setupMocks(true, isAdmin, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });

    it('should handle no albums found', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const isAdmin = false;
        const albums = [];
        const media = [];

        setupMocks(true, isAdmin, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });

    it('should handle invalid session token', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const isAdmin = false;

        setupMocks(false, isAdmin, [], []);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, [], [], 'Invalid session token');
    });

    it('should handle media not found for albums', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const isAdmin = false;
        const albums = [{ id: 1, name: 'Album 1' }];
        const media = [];

        setupMocks(true, isAdmin, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });

    it('should handle errors in filtering albums', async () => {
        const filter = 'throwError';
        const pagination = {};
        const sorting = {};
        const isAdmin = false;
        const albums = [{ id: 1, name: 'Album 1' }];
        const media = [{ id: 1, albumId: 1, name: 'Media 1' }];

        setupMocks(true, isAdmin, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, [], [], 'Filter error');
    });
});
