import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listMediaComments from '../../../../src/resolvers/query/list/listMediaComments';

// Mock dependencies
const mockGetMediaCommentsByMediaId = jest.fn();

const db = {}; // Mock database object
const model = {
    MediaComment: {
        getMediaCommentsByMediaId: mockGetMediaCommentsByMediaId,
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

        mockGetMediaCommentsByMediaId.mockResolvedValue(comments);

        const result = await listMediaComments(null, { mediaId }, { db, model, utils, token });

        expect(mockGetMediaCommentsByMediaId).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(comments);
    });

    it('should handle no comments found for a media item', async () => {
        const mediaId = 1;
        const comments = [];

        mockGetMediaCommentsByMediaId.mockResolvedValue(comments);

        const result = await listMediaComments(null, { mediaId }, { db, model, utils, token });

        expect(mockGetMediaCommentsByMediaId).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(comments);
    });

    it('should handle database errors gracefully', async () => {
        const mediaId = 1;
        const errorMessage = 'Database error';

        mockGetMediaCommentsByMediaId.mockRejectedValue(new Error(errorMessage));

        await expect(listMediaComments(null, { mediaId }, { db, model, utils, token })).rejects.toThrow(errorMessage);
        expect(mockGetMediaCommentsByMediaId).toHaveBeenCalledWith(db, mediaId);
    });
});
