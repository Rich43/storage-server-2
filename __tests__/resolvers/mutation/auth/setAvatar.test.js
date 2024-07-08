import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import setAvatar from '../../../../src/resolvers/mutation/auth/setAvatar';
import {
    db,
    mockGetFirstMediaItemWithImageMimetypeById,
    mockGetUserById,
    mockUpdateUserAvatar,
    mockValidateToken,
    model,
    token,
    utils
} from '../../commonMocks';

const setupSetAvatarMocks = (isValidToken, session, media, updatedUser, validateTokenError = null) => {
    if (validateTokenError) {
        mockValidateToken.mockRejectedValue(new Error(validateTokenError));
    } else {
        mockValidateToken.mockResolvedValue(isValidToken ? session : null);
    }
    mockGetFirstMediaItemWithImageMimetypeById.mockResolvedValue(media);
    mockUpdateUserAvatar.mockResolvedValue(true);
    mockGetUserById.mockResolvedValue(updatedUser);
};

const assertSetAvatarMocks = async (result, media, updatedUser, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(updatedUser);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);

    if (!error) {
        expect(mockGetFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(db, expect.any(Number));
        expect(mockUpdateUserAvatar).toHaveBeenCalledWith(db, expect.any(Number), expect.any(Number));
        expect(mockGetUserById).toHaveBeenCalledWith(db, expect.any(Number));
    } else if (error.message === 'Media must have image mime type category') {
        expect(mockGetFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(db, expect.any(Number));
        expect(mockUpdateUserAvatar).not.toHaveBeenCalled();
        expect(mockGetUserById).not.toHaveBeenCalled();
    } else if (error.message === 'Invalid session token') {
        expect(mockGetFirstMediaItemWithImageMimetypeById).not.toHaveBeenCalled();
        expect(mockUpdateUserAvatar).not.toHaveBeenCalled();
        expect(mockGetUserById).not.toHaveBeenCalled();
    } else if (error.message === 'Failed to update avatar') {
        expect(mockGetFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(db, expect.any(Number));
        expect(mockUpdateUserAvatar).toHaveBeenCalledWith(db, expect.any(Number), expect.any(Number));
        expect(mockGetUserById).not.toHaveBeenCalled();
    }
};

describe('setAvatar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should set avatar successfully', async () => {
        const mediaId = 1;
        const session = { userId: 1 };
        const media = { id: 1, mimeType: 'image/png' };
        const updatedUser = { id: 1, avatar: mediaId };

        setupSetAvatarMocks(true, session, media, updatedUser);

        const result = setAvatar(null, { mediaId }, { db, model, utils, token });

        await assertSetAvatarMocks(result, media, updatedUser);
    });

    it('should throw an error if media is not an image', async () => {
        const mediaId = 1;
        const session = { userId: 1 };
        const media = null;

        setupSetAvatarMocks(true, session, media, null);

        const result = setAvatar(null, { mediaId }, { db, model, utils, token });

        await assertSetAvatarMocks(result, media, null, new Error('Media must have image mime type category'));
    });

    it('should throw an error if user is not authenticated', async () => {
        const mediaId = 1;

        setupSetAvatarMocks(false, null, null, null);

        const result = setAvatar(null, { mediaId }, { db, model, utils, token });

        await assertSetAvatarMocks(result, null, null, new Error('Invalid session token'));
    });

    it('should throw an error if updating avatar fails', async () => {
        const mediaId = 1;
        const session = { userId: 1 };
        const media = { id: 1, mimeType: 'image/png' };
        const updatedUser = null;

        setupSetAvatarMocks(true, session, media, updatedUser);

        mockUpdateUserAvatar.mockRejectedValue(new Error('Failed to update avatar'));

        const result = setAvatar(null, { mediaId }, { db, model, utils, token });

        await assertSetAvatarMocks(result, media, null, new Error('Failed to update avatar'));
    });

    it('should throw a general error if validateToken throws an unexpected error', async () => {
        const mediaId = 1;

        setupSetAvatarMocks(false, null, null, null, 'Unexpected error');

        const result = setAvatar(null, { mediaId }, { db, model, utils, token });

        await assertSetAvatarMocks(result, null, null, new Error('Unexpected error'));
    });
});
