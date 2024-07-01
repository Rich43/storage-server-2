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

const setupMocks = (userSession, albums, media) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetAdminFlagFromSession.mockResolvedValue(userSession);
    mockGetAllAlbums.mockResolvedValue(albums);
    mockFilterAlbum.mockImplementation((filter, query) => query);
    mockPerformPagination.mockImplementation((pagination, query) => query);
    mockPerformSorting.mockImplementation((sorting, query) => query);
    mockGetMediaByAlbumIdJoiningOnAlbumMediaAndMimetype.mockResolvedValue(media);
    mockAddAdminOnlyRestriction.mockImplementation((userSession, query) => query);
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

    expect(mockValidateToken).toHaveBeenCalledWith(db, token);
    expect(mockGetAdminFlagFromSession).toHaveBeenCalledWith(db, token);
    expect(mockGetAllAlbums).toHaveBeenCalledWith(db);
    expect(mockFilterAlbum).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformPagination).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(mockPerformSorting).toHaveBeenCalledWith(expect.anything(), expect.anything());

    for (const album of albums) {
        expect(mockGetMediaByAlbumIdJoiningOnAlbumMediaAndMimetype).toHaveBeenCalledWith(db, album);
        expect(mockAddAdminOnlyRestriction).toHaveBeenCalledWith(expect.anything(), expect.anything());
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
        const userSession = { admin: false };
        const albums = [{ id: 1, name: 'Album 1' }];
        const media = [{ id: 1, albumId: 1, name: 'Media 1' }];

        setupMocks(userSession, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });

    it('should list albums successfully for an admin user', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const userSession = { admin: true };
        const albums = [{ id: 1, name: 'Album 1' }];
        const media = [{ id: 1, albumId: 1, name: 'Media 1' }];

        setupMocks(userSession, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });

    it('should handle no albums found', async () => {
        const filter = {};
        const pagination = {};
        const sorting = {};
        const userSession = { admin: false };
        const albums = [];
        const media = [];

        setupMocks(userSession, albums, media);

        const result = listAlbums(null, { filter, pagination, sorting }, { db, model, utils, token });

        await assertCommonMocks(result, albums, media);
    });
});
