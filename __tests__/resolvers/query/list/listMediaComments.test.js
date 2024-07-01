import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listMediaComments from '../../../../src/resolvers/query/list/listMediaComments';

// Mock dependencies
const mockDbListMediaComments = jest.fn();

const db = {}; // Mock database object
const model = {
    MediaComment: {
        dbListMediaComments: mockDbListMediaComments,
    }
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

describe('listMediaComments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list comments for a media item', async () => {
        const mediaId = 1;
        const comments = [{ id: 1, mediaId, comment: 'Great media!' }];

        mockDbListMediaComments.mockResolvedValue(comments);

        const result = await listMediaComments(null, { mediaId }, { db, model, utils, token });

        expect(mockDbListMediaComments).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(comments);
    });

    it('should handle no comments found for a media item', async () => {
        const mediaId = 1;
        const comments = [];

        mockDbListMediaComments.mockResolvedValue(comments);

        const result = await listMediaComments(null, { mediaId }, { db, model, utils, token });

        expect(mockDbListMediaComments).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(comments);
    });

    it('should handle database errors gracefully', async () => {
        const mediaId = 1;
        const errorMessage = 'Database error';

        mockDbListMediaComments.mockRejectedValue(new Error(errorMessage));

        await expect(listMediaComments(null, { mediaId }, { db, model, utils, token })).rejects.toThrow(errorMessage);
        expect(mockDbListMediaComments).toHaveBeenCalledWith(db, mediaId);
    });
});
