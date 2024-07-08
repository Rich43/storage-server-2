// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import deleteMedia from '../../../src/resolvers/mutation/deleteMedia';
import { db, model, utils, token, setupMocks, mockValidateToken, mockGetUserFromToken, mockGetMediaById, mockDeleteMediaById } from '../commonMocks';

const setupDeleteMediaMocks = (isValidToken, user, media) => {
    mockValidateToken.mockResolvedValue(isValidToken ? {} : Promise.reject(new Error('Invalid session token')));
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaById.mockResolvedValue(media);
    mockDeleteMediaById.mockResolvedValue(true);
};

const assertDeleteMediaMocks = async (result, media, user, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(true);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);

    if (!error || error !== 'Invalid session token') {
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, media ? media.id : expect.any(Number));
    } else {
        expect(mockGetUserFromToken).not.toHaveBeenCalled();
        expect(mockGetMediaById).not.toHaveBeenCalled();
    }

    if (!error) {
        expect(mockDeleteMediaById).toHaveBeenCalledWith(db, media.id);
    } else {
        expect(mockDeleteMediaById).not.toHaveBeenCalled();
    }
};

describe('deleteMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete media successfully', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const media = { id, userId: 1, adminOnly: false };

        setupDeleteMediaMocks(true, user, media);

        const result = deleteMedia(null, { id }, { db, model, utils, token });

        await assertDeleteMediaMocks(result, media, user);
    });

    it('should delete adminOnly media successfully for admin user', async () => {
        const id = 1;
        const user = { id: 2, admin: true };
        const media = { id, userId: 2, adminOnly: true };

        setupDeleteMediaMocks(true, user, media);

        const result = deleteMedia(null, { id }, { db, model, utils, token });

        await assertDeleteMediaMocks(result, media, user);
    });

    it('should throw an error if media not found', async () => {
        const id = 1;
        const user = { id: 1, admin: false };

        setupDeleteMediaMocks(true, user, null);

        const result = deleteMedia(null, { id }, { db, model, utils, token });

        await assertDeleteMediaMocks(result, { id }, user, 'Media not found');
    });

    it('should throw an error if user is not authorized to delete media', async () => {
        const id = 1;
        const user = { id: 2, admin: false };
        const media = { id, userId: 1, adminOnly: false };

        setupDeleteMediaMocks(true, user, media);

        const result = deleteMedia(null, { id }, { db, model, utils, token });

        await assertDeleteMediaMocks(result, media, user, 'You can only delete your own media');
    });

    it('should throw an error if user is not admin and tries to delete adminOnly media', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const media = { id, userId: 1, adminOnly: true };

        setupDeleteMediaMocks(true, user, media);

        const result = deleteMedia(null, { id }, { db, model, utils, token });

        await assertDeleteMediaMocks(result, media, user, 'Only admins can delete adminOnly media');
    });

    it('should handle invalid session token', async () => {
        const id = 1;

        setupDeleteMediaMocks(false, null, null);

        const result = deleteMedia(null, { id }, { db, model, utils, token });

        await assertDeleteMediaMocks(result, null, null, 'Invalid session token');
    });
});
