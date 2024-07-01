import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import createMedia from '../../../src/resolvers/mutation/createMedia';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
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
    Media: {
        insertMedia: mockInsertMedia,
        getMediaById: mockGetMediaById,
    },
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

describe('createMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create media successfully for an admin user with adminOnly set to true', async () => {
        const input = { title: 'Sample Media', adminOnly: true };
        const user = { id: 1, username: 'adminUser', admin: true };
        const mediaId = 1;
        const media = { id: mediaId, title: 'Sample Media', adminOnly: true };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockInsertMedia.mockResolvedValue([mediaId]);
        mockGetMediaById.mockResolvedValue(media);

        const result = await createMedia(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockInsertMedia).toHaveBeenCalledWith(db, user, true, input);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(media);
    });

    it('should create media successfully for a non-admin user with adminOnly set to true', async () => {
        const input = { title: 'Sample Media', adminOnly: true };
        const user = { id: 2, username: 'regularUser', admin: false };
        const mediaId = 2;
        const media = { id: mediaId, title: 'Sample Media', adminOnly: false };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockInsertMedia.mockResolvedValue([mediaId]);
        mockGetMediaById.mockResolvedValue(media);

        const result = await createMedia(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockInsertMedia).toHaveBeenCalledWith(db, user, false, input);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(media);
    });

    it('should handle errors during media creation', async () => {
        const input = { title: 'Sample Media', adminOnly: false };
        const user = { id: 1, username: 'adminUser', admin: true };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockInsertMedia.mockRejectedValue(new Error('Database error'));

        await expect(createMedia(null, { input }, { db, model, utils, token })).rejects.toThrow('Database error');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockInsertMedia).toHaveBeenCalledWith(db, user, false, input);
        expect(mockGetMediaById).not.toHaveBeenCalled();
    });
});
