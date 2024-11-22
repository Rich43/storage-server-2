import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listRelatedMedia from '../../../../src/resolvers/query/list/listRelatedMedia';

describe('listRelatedMedia', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            Media: {
                getMediaById: jest.fn(),
                addRelatedKeywords: jest.fn(),
            },
            Session: {
                validateToken: jest.fn().mockResolvedValue(true), // Mock token validation
            },
        };
        mockUtils = {
            getMediaKeywords: jest.fn(),
        };
        mockToken = 'mockToken';
    });

    it('should list related media successfully', async () => {
        const id = 1;
        const media = { id, title: 'Test Media' };
        const keywords = ['keyword1', 'keyword2'];
        const relatedMedia = [{ id: 2, title: 'Related Media' }];

        mockModel.Media.getMediaById.mockResolvedValue(media);
        mockUtils.getMediaKeywords.mockReturnValue(keywords);
        mockModel.Media.addRelatedKeywords.mockReturnValue({
            select: jest.fn().mockResolvedValue(relatedMedia), // Simulate query execution
        });

        const result = await listRelatedMedia(null, { id }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.Media.getMediaById).toHaveBeenCalledWith(mockDb, id);
        expect(mockUtils.getMediaKeywords).toHaveBeenCalledWith(media);
        expect(mockModel.Media.addRelatedKeywords).toHaveBeenCalledWith(mockDb, id, keywords);
        expect(result).toEqual(relatedMedia);
    });

    it('should throw an error if media is not found', async () => {
        const id = 1;

        mockModel.Media.getMediaById.mockResolvedValue(null);

        await expect(listRelatedMedia(null, { id }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Media not found');
    });

    it('should handle unexpected errors', async () => {
        const id = 1;
        const errorMessage = 'Unexpected error';

        mockModel.Media.getMediaById.mockRejectedValue(new Error(errorMessage));

        await expect(listRelatedMedia(null, { id }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Failed to list related media');
    });
});
