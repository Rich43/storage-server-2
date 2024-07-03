import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import createMedia from '../../../src/resolvers/mutation/createMedia';

describe('createMedia', () => {
    let db, model, utils, token, context;
    const userAdmin = { id: 1, admin: true };
    const userNonAdmin = { id: 2, admin: false };
    const mimetype = { id: 1 };

    beforeEach(() => {
        db = {};
        token = 'valid-token';

        model = {
            Session: {
                validateToken: jest.fn().mockResolvedValue(true),
            },
            User: {
                getUserFromToken: jest.fn(),
            },
            Mimetype: {
                getMimetypeIdByType: jest.fn().mockResolvedValue(mimetype),
            },
            Media: {
                insertMedia: jest.fn(),
                getMediaById: jest.fn(),
            },
        };

        utils = {};

        context = { db, model, utils, token };
    });

    const commonAssertions = async (input, user, mediaAdminOnly, mediaId, expectedMedia) => {
        model.User.getUserFromToken.mockResolvedValue(user);
        model.Media.insertMedia.mockResolvedValue([mediaId]);
        model.Media.getMediaById.mockResolvedValue(expectedMedia);

        const result = await createMedia(null, { input }, context);

        expect(result).toEqual(expectedMedia);
        expect(model.Session.validateToken).toHaveBeenCalledWith(db, token);
        expect(model.User.getUserFromToken).toHaveBeenCalledWith(db, token);
        expect(model.Mimetype.getMimetypeIdByType).toHaveBeenCalledWith(db, input.mimetype);
        expect(model.Media.insertMedia).toHaveBeenCalledWith(db, user, mediaAdminOnly, input, mimetype);
        expect(model.Media.getMediaById).toHaveBeenCalledWith(db, mediaId);
    };

    it('should create media successfully for an admin user with adminOnly set to true', async () => {
        const input = {
            title: 'Test Title',
            description: 'Test Description',
            url: 'http://test.url',
            mimetype: 'image/png',
            thumbnail: 'http://test.thumbnail',
            adminOnly: true
        };

        const mediaId = 1;
        const expectedMedia = {
            id: mediaId,
            title: 'Test Title',
            description: 'Test Description',
            url: 'http://test.url',
            mimetypeId: mimetype.id,
            thumbnail: 'http://test.thumbnail',
            userId: userAdmin.id,
            adminOnly: true,
        };

        await commonAssertions(input, userAdmin, true, mediaId, expectedMedia);
    });

    it('should create media successfully for a non-admin user with adminOnly set to false', async () => {
        const input = {
            title: 'Test Title User',
            description: 'Test Description User',
            url: 'http://test.user.url',
            mimetype: 'image/jpeg',
            thumbnail: 'http://test.user.thumbnail',
            adminOnly: true
        };

        const mediaId = 2;
        const expectedMedia = {
            id: mediaId,
            title: 'Test Title User',
            description: 'Test Description User',
            url: 'http://test.user.url',
            mimetypeId: mimetype.id,
            thumbnail: 'http://test.user.thumbnail',
            userId: userNonAdmin.id,
            adminOnly: false,
        };

        await commonAssertions(input, userNonAdmin, false, mediaId, expectedMedia);
    });

    it('should handle errors during media creation', async () => {
        const input = {
            title: 'Error Title',
            description: 'Error Description',
            url: 'http://error.url',
            mimetype: 'image/gif',
            thumbnail: 'http://error.thumbnail',
            adminOnly: true
        };

        const user = { id: 3, admin: true };

        model.User.getUserFromToken.mockResolvedValue(user);
        model.Media.insertMedia.mockRejectedValue(new Error('Database error'));

        await expect(createMedia(null, { input }, context)).rejects.toThrow('Database error');
    });
});
