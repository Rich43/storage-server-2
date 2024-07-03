import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import editMedia from '../../../src/resolvers/mutation/editMedia';
import moment from 'moment';

describe('editMedia unit tests', () => {
    let mockDb, mockModel, mockUtils, context;

    beforeEach(() => {
        mockDb = {};
        mockModel = {
            Session: {
                validateToken: jest.fn()
            },
            User: {
                getUserFromToken: jest.fn()
            },
            Media: {
                getMediaById: jest.fn(),
                updateMediaById: jest.fn()
            },
            Mimetype: {
                getMimetypeIdByType: jest.fn()
            }
        };
        mockUtils = {
            moment: moment
        };
        context = {
            db: mockDb,
            model: mockModel,
            utils: mockUtils,
            token: 'validtoken'
        };
    });

    it('should edit media as a regular user', async () => {
        const input = {
            id: 1,
            title: 'Updated Title',
            description: 'Updated Description',
            url: 'http://updated.url',
            mimetype: 'image/png',
            thumbnail: 2
        };

        const mockMedia = {
            id: 1,
            title: 'Original Title',
            description: 'Original Description',
            url: 'http://original.url',
            mimetype_id: 1,
            thumbnail: 1,
            adminOnly: false
        };

        mockModel.Session.validateToken.mockResolvedValue(true);
        mockModel.User.getUserFromToken.mockResolvedValue({ userId: 1, admin: false });
        mockModel.Media.getMediaById.mockResolvedValue(mockMedia);
        mockModel.Mimetype.getMimetypeIdByType.mockResolvedValue({ id: 1 });
        mockModel.Media.getMediaById.mockResolvedValue({
            ...mockMedia,
            ...input,
            updated: moment().utc().toISOString()
        });

        const result = await editMedia(null, { input }, context);

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.Media.getMediaById).toHaveBeenCalledWith(mockDb, 1);
        expect(mockModel.Mimetype.getMimetypeIdByType).toHaveBeenCalledWith(mockDb, 'image/png');
        expect(mockModel.Media.updateMediaById).toHaveBeenCalledWith(mockDb, 1, expect.objectContaining({
            title: 'Updated Title',
            description: 'Updated Description',
            url: 'http://updated.url',
            mimetype_id: 1,
            thumbnail: 2
        }));
        expect(result).toEqual({
            ...mockMedia,
            ...input,
            updated: expect.any(String)
        });
    });

    it('should edit media as an admin user', async () => {
        const input = {
            id: 1,
            title: 'Updated Title',
            description: 'Updated Description',
            url: 'http://updated.url',
            mimetype: 'image/png',
            thumbnail: 2,
            adminOnly: true
        };

        const mockMedia = {
            id: 1,
            title: 'Original Title',
            description: 'Original Description',
            url: 'http://original.url',
            mimetype_id: 1,
            thumbnail: 1,
            adminOnly: false
        };

        mockModel.Session.validateToken.mockResolvedValue(true);
        mockModel.User.getUserFromToken.mockResolvedValue({ userId: 1, admin: true });
        mockModel.Media.getMediaById.mockResolvedValue(mockMedia);
        mockModel.Mimetype.getMimetypeIdByType.mockResolvedValue({ id: 1 });
        mockModel.Media.getMediaById.mockResolvedValue({
            ...mockMedia,
            ...input,
            updated: moment().utc().toISOString()
        });

        const result = await editMedia(null, { input }, context);

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.Media.getMediaById).toHaveBeenCalledWith(mockDb, 1);
        expect(mockModel.Mimetype.getMimetypeIdByType).toHaveBeenCalledWith(mockDb, 'image/png');
        expect(mockModel.Media.updateMediaById).toHaveBeenCalledWith(mockDb, 1, expect.objectContaining({
            title: 'Updated Title',
            description: 'Updated Description',
            url: 'http://updated.url',
            mimetype_id: 1,
            thumbnail: 2,
            adminOnly: true
        }));
        expect(result).toEqual({
            ...mockMedia,
            ...input,
            updated: expect.any(String)
        });
    });

    it('should throw an error if media not found', async () => {
        const input = {
            id: 1,
            title: 'Updated Title'
        };

        mockModel.Session.validateToken.mockResolvedValue(true);
        mockModel.User.getUserFromToken.mockResolvedValue({ userId: 1, admin: false });
        mockModel.Media.getMediaById.mockResolvedValue(null);

        await expect(editMedia(null, { input }, context)).rejects.toThrow('Media not found');
    });
});
