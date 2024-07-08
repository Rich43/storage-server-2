import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import setAvatar from '../../../../src/resolvers/mutation/auth/setAvatar';

describe('setAvatar', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            Session: {
                validateToken: jest.fn(),
            },
            Media: {
                getFirstMediaItemWithImageMimetypeById: jest.fn(),
            },
            User: {
                updateUserAvatar: jest.fn(),
                getUserById: jest.fn(),
            },
        };
        mockUtils = {};
        mockToken = 'mockToken';
    });

    it('should set avatar successfully', async () => {
        const session = { userId: 1 };
        const mediaId = 1;
        const media = { id: mediaId, mimeType: 'image/png' };
        const updatedUser = { id: 1, username: 'testuser', avatar: mediaId };

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Media.getFirstMediaItemWithImageMimetypeById.mockResolvedValue(media);
        mockModel.User.updateUserAvatar.mockResolvedValue();
        mockModel.User.getUserById.mockResolvedValue(updatedUser);

        const result = await setAvatar(null, { mediaId }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, mockUtils, mockToken);
        expect(mockModel.Media.getFirstMediaItemWithImageMimetypeById).toHaveBeenCalledWith(mockDb, mediaId);
        expect(mockModel.User.updateUserAvatar).toHaveBeenCalledWith(mockDb, mockUtils, session.userId, mediaId);
        expect(mockModel.User.getUserById).toHaveBeenCalledWith(mockDb, session.userId);
        expect(result).toEqual(updatedUser);
    });

    it('should throw an error if session is invalid', async () => {
        const mediaId = 1;

        mockModel.Session.validateToken.mockResolvedValue(null);

        await expect(setAvatar(null, { mediaId }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Invalid session token');
    });

    it('should throw an error if media does not have an image mime type category', async () => {
        const session = { userId: 1 };
        const mediaId = 1;

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Media.getFirstMediaItemWithImageMimetypeById.mockResolvedValue(null);

        await expect(setAvatar(null, { mediaId }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Media must have image mime type category');
    });

    it('should throw an error if updating avatar fails', async () => {
        const session = { userId: 1 };
        const mediaId = 1;
        const media = { id: mediaId, mimeType: 'image/png' };

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Media.getFirstMediaItemWithImageMimetypeById.mockResolvedValue(media);
        mockModel.User.updateUserAvatar.mockRejectedValue(new Error('Update failed'));

        await expect(setAvatar(null, { mediaId }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Update failed');
    });

    it('should throw an error if fetching updated user fails', async () => {
        const session = { userId: 1 };
        const mediaId = 1;
        const media = { id: mediaId, mimeType: 'image/png' };

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Media.getFirstMediaItemWithImageMimetypeById.mockResolvedValue(media);
        mockModel.User.updateUserAvatar.mockResolvedValue();
        mockModel.User.getUserById.mockRejectedValue(new Error('User not found'));

        await expect(setAvatar(null, { mediaId }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('User not found');
    });
});
