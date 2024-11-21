import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import createMedia from '../../../../src/resolvers/mutation/create/createMedia.js';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMimetypeIdByType = jest.fn();
const mockInsertMedia = jest.fn();
const mockGetMediaById = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Mimetype: {
        getMimetypeIdByType: mockGetMimetypeIdByType,
    },
    Media: {
        insertMedia: mockInsertMedia,
        getMediaById: mockGetMediaById,
    }
};
const utils = {}; // Mock utils object
const token = 'mock-token'; // Mock token object

const setupMocks = (isValidToken, user, mimetype, mediaId, media) => {
    mockValidateToken.mockResolvedValue(isValidToken ? {} : Promise.reject(new Error('Invalid session token')));
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMimetypeIdByType.mockResolvedValue(mimetype);
    mockInsertMedia.mockResolvedValue([mediaId]);
    mockGetMediaById.mockResolvedValue(media);
};

const assertCommonMocks = async (input, user, expectedAdminOnlyFlag, mediaId, media) => {
    const result = await createMedia(null, { input }, { db, model, utils, token });

    expect(result).toEqual(media);
    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
    expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
    expect(mockGetMimetypeIdByType).toHaveBeenCalledWith(db, input.mimetype);
    expect(mockInsertMedia).toHaveBeenCalledWith(db, user, expectedAdminOnlyFlag, input, await mockGetMimetypeIdByType.mock.results[0].value);
    expect(mockGetMediaById).toHaveBeenCalledWith(db, mediaId);
};

describe('createMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create media successfully', async () => {
        const input = {
            adminOnly: false,
            mimetype: 'image/png',
            otherData: 'some data'
        };
        const user = { id: 1, admin: false };
        const mimetype = 1;
        const mediaId = 1;
        const media = { id: mediaId, ...input };

        setupMocks(true, user, mimetype, mediaId, media);

        await assertCommonMocks(input, user, false, mediaId, media);
    });

    it('should create media with adminOnly flag for admin user', async () => {
        const input = {
            adminOnly: true,
            mimetype: 'image/png',
            otherData: 'some data'
        };
        const user = { id: 1, admin: true };
        const mimetype = 1;
        const mediaId = 1;
        const media = { id: mediaId, ...input };

        setupMocks(true, user, mimetype, mediaId, media);

        await assertCommonMocks(input, user, true, mediaId, media);
    });

    it('should handle invalid session token', async () => {
        const input = {
            adminOnly: false,
            mimetype: 'image/png',
            otherData: 'some data'
        };

        setupMocks(false, null, null, null, null);

        await expect(createMedia(null, { input }, { db, model, utils, token }))
            .rejects
            .toThrow('Invalid session token');

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetUserFromToken).not.toHaveBeenCalled();
        expect(mockGetMimetypeIdByType).not.toHaveBeenCalled();
        expect(mockInsertMedia).not.toHaveBeenCalled();
        expect(mockGetMediaById).not.toHaveBeenCalled();
    });

    it('should only allow admin to set adminOnly flag', async () => {
        const input = {
            adminOnly: true,
            mimetype: 'image/png',
            otherData: 'some data'
        };
        const user = { id: 1, admin: false };
        const mimetype = 1;
        const mediaId = 1;
        const media = { id: mediaId, ...input, adminOnly: false };

        setupMocks(true, user, mimetype, mediaId, media);

        await assertCommonMocks(input, user, false, mediaId, media);
    });
});
