import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import getMediaById from '../../../src/resolvers/query/getMediaById.js';

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
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

const setupMocks = (user, media) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaByIdJoiningOntoMimeType.mockResolvedValue(media);
};

const assertCommonMocks = async (result, media, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(media);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, token);
    expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
    expect(mockGetMediaByIdJoiningOntoMimeType).toHaveBeenCalledWith(db, media.id);
};

describe('getMediaById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return media for authorized user', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const media = { id: 1, adminOnly: false, title: 'Test Media' };

        setupMocks(user, media);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, media);
    });

    it('should throw an error if media not found', async () => {
        const id = 1;
        const user = { id: 1, admin: false };

        setupMocks(user, null);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, { id }, 'Media not found');
    });

    it('should throw an error if user does not have permission to view adminOnly media', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const media = { id: 1, adminOnly: true, title: 'Admin Media' };

        setupMocks(user, media);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, media, 'You do not have permission to view this media');
    });

    it('should return adminOnly media for admin user', async () => {
        const id = 1;
        const user = { id: 1, admin: true };
        const media = { id: 1, adminOnly: true, title: 'Admin Media' };

        setupMocks(user, media);

        const result = getMediaById(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, media);
    });
});
