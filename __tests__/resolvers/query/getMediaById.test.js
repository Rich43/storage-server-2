// noinspection JSCheckFunctionSignatures
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import getMediaById from '../../../src/resolvers/query/getMediaById';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaByIdJoiningOntoMimeType = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Media: {
        getMediaByIdJoiningOntoMimeType: mockGetMediaByIdJoiningOntoMimeType,
    }
};
const utils = {}; // Mock utils object
const token = 'mock-token'; // Mock token object

const setupMocks = (isValidToken, user, media) => {
    mockValidateToken.mockResolvedValue(isValidToken ? {} : Promise.reject(new Error('Invalid session token')));
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaByIdJoiningOntoMimeType.mockResolvedValue(media);
};

const assertCommonMocks = async (result, user, media, id, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(media);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
    if (error !== 'Invalid session token') {
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaByIdJoiningOntoMimeType).toHaveBeenCalledWith(db, id);
    } else {
        expect(mockGetUserFromToken).not.toHaveBeenCalled();
        expect(mockGetMediaByIdJoiningOntoMimeType).not.toHaveBeenCalled();
    }
};

describe('getMediaById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return media if it exists and user has permission', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const media = { id, adminOnly: false, name: 'Test Media' };

        setupMocks(true, user, media);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, media, id);
    });

    it('should return media if it exists and user is admin', async () => {
        const id = 1;
        const user = { id: 1, admin: true };
        const media = { id, adminOnly: true, name: 'Test Media' };

        setupMocks(true, user, media);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, media, id);
    });

    it('should throw an error if media does not exist', async () => {
        const id = 1;
        const user = { id: 1, admin: false };

        setupMocks(true, user, null);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, null, id, 'Media not found');
    });

    it('should throw an error if user does not have permission to view admin-only media', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const media = { id, adminOnly: true, name: 'Test Media' };

        setupMocks(true, user, media);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, media, id, 'You do not have permission to view this media');
    });

    it('should handle invalid session token', async () => {
        const id = 1;

        setupMocks(false, null, null);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, null, null, id, 'Invalid session token');
    });
});
