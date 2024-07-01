import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import setAvatar from '../../../../src/resolvers/mutation/auth/setAvatar';
import { CustomError } from '../../../../src/resolvers/utils/CustomError';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetFirstMediaItemWithImageMimetypeById = jest.fn();
const mockUpdateUserAvatar = jest.fn();
const mockGetUserById = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    Media: {
        getFirstMediaItemWithImageMimetypeById: mockGetFirstMediaItemWithImageMimetypeById,
    },
    User: {
        updateUserAvatar: mockUpdateUserAvatar,
        getUserById: mockGetUserById,
    },
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

describe('setAvatar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should set user avatar successfully with valid token and mediaId', async () => {
        const mediaId = 'valid-media-id';
        const session = { userId: 1 };
        const media = { id: mediaId, mimeType: 'image/png' };
        const updatedUser = { id: 1, username: 'validUser', avatar: mediaId };

        mockValidateToken.mockResolvedValue(session);
        mockGetFirstMediaItemWithImageMimetypeById.mockResolvedValue(media);
        mockUpdateUserAvatar.mockResolvedValue(true);
        mockGetUserById.mockResolvedValue(updatedUser);

        const result = await setAvatar(null, { mediaId }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(db, mediaId);
        expect(mockUpdateUserAvatar).toHaveBeenCalledWith(db, session.userId, mediaId);
        expect(mockGetUserById).toHaveBeenCalledWith(db, session.userId);
        expect(result).toEqual(updatedUser);
    });

    it('should throw an error if not authenticated', async () => {
        mockValidateToken.mockResolvedValue(null);

        try {
            await setAvatar(null, { mediaId: 'valid-media-id' }, { db, model, utils, token });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Failed to set avatar');
            expect(error.originalError.message).toBe('Not authenticated');
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetFirstMediaItemWithImageMimetypeById).not.toHaveBeenCalled();
        expect(mockUpdateUserAvatar).not.toHaveBeenCalled();
        expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it('should throw an error if media does not have image mime type', async () => {
        const mediaId = 'invalid-media-id';
        const session = { userId: 1 };

        mockValidateToken.mockResolvedValue(session);
        mockGetFirstMediaItemWithImageMimetypeById.mockResolvedValue(null);

        try {
            await setAvatar(null, { mediaId }, { db, model, utils, token });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Failed to set avatar');
            expect(error.originalError.message).toBe('Media must have image mime type category');
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(db, mediaId);
        expect(mockUpdateUserAvatar).not.toHaveBeenCalled();
        expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it('should handle errors during user avatar update', async () => {
        const mediaId = 'valid-media-id';
        const session = { userId: 1 };
        const media = { id: mediaId, mimeType: 'image/png' };

        mockValidateToken.mockResolvedValue(session);
        mockGetFirstMediaItemWithImageMimetypeById.mockResolvedValue(media);
        mockUpdateUserAvatar.mockRejectedValue(new Error('Database error'));

        try {
            await setAvatar(null, { mediaId }, { db, model, utils, token });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Failed to set avatar');
            expect(error.originalError.message).toBe('Database error');
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(db, mediaId);
        expect(mockUpdateUserAvatar).toHaveBeenCalledWith(db, session.userId, mediaId);
        expect(mockGetUserById).not.toHaveBeenCalled();
    });
});