import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listRelatedMedia from '../../../../src/resolvers/query/list/listRelatedMedia';
import { CustomError } from '../../../../src/resolvers/utils/CustomError';
import {
    db,
    model,
    utils,
    token,
    setupMocks,
} from '../../commonMocks.js'; // Adjust the path as necessary

const mockGetMediaById = jest.fn();
const mockGetMediaKeywords = jest.fn();
const mockAddRelatedKeywords = jest.fn();

model.Media.getMediaById = mockGetMediaById;
utils.getMediaKeywords = mockGetMediaKeywords;
model.Media.addRelatedKeywords = mockAddRelatedKeywords;

const setupRelatedMediaMocks = (media, keywords, relatedMedia) => {
    mockGetMediaById.mockResolvedValue(media);
    mockGetMediaKeywords.mockReturnValue(keywords);
    mockAddRelatedKeywords.mockResolvedValue(relatedMedia);
};

describe('listRelatedMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list related media successfully', async () => {
        const id = 1;
        const media = { id: 1, name: 'Media 1' };
        const keywords = ['keyword1', 'keyword2'];
        const relatedMedia = [{ id: 2, name: 'Related Media 1' }];

        setupRelatedMediaMocks(media, keywords, relatedMedia);

        const result = await listRelatedMedia(null, { id }, { db, model, utils, token });

        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockGetMediaKeywords).toHaveBeenCalledWith(media);
        expect(mockAddRelatedKeywords).toHaveBeenCalledWith(db, id, keywords);
        expect(result).toEqual(relatedMedia);
    });

    it('should throw a CustomError if media not found', async () => {
        const id = 1;

        mockGetMediaById.mockResolvedValue(null);

        await expect(listRelatedMedia(null, { id }, { db, model, utils, token })).rejects.toThrow(CustomError);

        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockGetMediaKeywords).not.toHaveBeenCalled();
        expect(mockAddRelatedKeywords).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully with CustomError', async () => {
        const id = 1;
        const errorMessage = 'Database error';

        mockGetMediaById.mockRejectedValue(new Error(errorMessage));

        await expect(listRelatedMedia(null, { id }, { db, model, utils, token })).rejects.toThrow(CustomError);

        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockGetMediaKeywords).not.toHaveBeenCalled();
        expect(mockAddRelatedKeywords).not.toHaveBeenCalled();
    });
});
