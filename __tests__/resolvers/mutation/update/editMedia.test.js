import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import editMedia from "../../../../src/resolvers/mutation/update/editMedia.js";

describe('editMedia', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            Media: {
                updateMediaById: jest.fn(),
                getMediaById: jest.fn(),
            },
        };
        mockUtils = {
            validateSessionAndUser: jest.fn(),
            getMimetypeId: jest.fn(),
            moment: jest.fn().mockReturnValue({
                utc: jest.fn().mockReturnValue({
                    toISOString: jest.fn().mockReturnValue('2024-07-08T00:00:00.000Z'),
                }),
            }),
            buildUpdatedMedia: jest.fn(),
        };
        mockToken = 'mockToken';
    });

    it('should edit media successfully', async () => {
        const input = {
            id: 1,
            mimetype: 'image/png',
            // other input fields
        };
        const user = { id: 1, name: 'Test User' };
        const mimetypeId = 123;
        const updatedMedia = { /* built updated media object */ };

        mockUtils.validateSessionAndUser.mockResolvedValue(user);
        mockUtils.getMimetypeId.mockResolvedValue(mimetypeId);
        mockUtils.buildUpdatedMedia.mockReturnValue(updatedMedia);
        mockModel.Media.updateMediaById.mockResolvedValue();
        mockModel.Media.getMediaById.mockResolvedValue(updatedMedia);

        const result = await editMedia(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockUtils.validateSessionAndUser).toHaveBeenCalledWith(mockDb, mockModel, mockUtils, mockToken);
        expect(mockUtils.getMimetypeId).toHaveBeenCalledWith(mockDb, mockModel, input.mimetype);
        expect(mockUtils.buildUpdatedMedia).toHaveBeenCalledWith(input, mimetypeId, '2024-07-08T00:00:00.000Z', user);
        expect(mockModel.Media.updateMediaById).toHaveBeenCalledWith(mockDb, input.id, updatedMedia);
        expect(mockModel.Media.getMediaById).toHaveBeenCalledWith(mockDb, input.id);
        expect(result).toEqual(updatedMedia);
    });

    it('should throw an error if user validation fails', async () => {
        mockUtils.validateSessionAndUser.mockResolvedValue(null);

        await expect(editMedia(null, { input: {} }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('User validation failed');
    });

    it('should throw an error if media not found after update', async () => {
        const input = { id: 1 };

        mockUtils.validateSessionAndUser.mockResolvedValue({ id: 1, name: 'Test User' });
        mockModel.Media.updateMediaById.mockResolvedValue();
        mockModel.Media.getMediaById.mockResolvedValue(null);

        await expect(editMedia(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Media not found after update');
    });

    it('should handle unexpected errors', async () => {
        const input = { id: 1 };
        const errorMessage = 'Unexpected error';

        mockUtils.validateSessionAndUser.mockRejectedValue(new Error(errorMessage));

        await expect(editMedia(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow(errorMessage);
    });
});
