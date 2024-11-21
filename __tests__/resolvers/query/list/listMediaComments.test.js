import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listMediaComments from '../../../../src/resolvers/query/list/listMediaComments';

// Mock dependencies
const mockGetMediaCommentsByMediaId = jest.fn();
const mockValidateToken = jest.fn();

const db = {}; // Mock database object
const model = {
    MediaComment: {
        getMediaCommentsByMediaId: mockGetMediaCommentsByMediaId,
    },
    Session: {
        validateToken: mockValidateToken,
    },
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

let mediaId;
let comments;

describe('listMediaComments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mediaId = 1;
        comments = [{ id: 1, mediaId, comment: 'Great media!' }];

        // Default mocks
        mockValidateToken.mockResolvedValue(true); // Simulate valid token
        mockGetMediaCommentsByMediaId.mockResolvedValue(comments);
    });

    const executeResolver = () => listMediaComments(null, { mediaId }, { db, model, utils, token });

    it('should validate the token and list comments for a media item', async () => {
        const result = await executeResolver();

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token); // Check token validation
        expect(mockGetMediaCommentsByMediaId).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(comments);
    });

    it('should validate the token and handle no comments found for a media item', async () => {
        comments = [];
        mockGetMediaCommentsByMediaId.mockResolvedValue(comments);

        const result = await executeResolver();

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token); // Check token validation
        expect(mockGetMediaCommentsByMediaId).toHaveBeenCalledWith(db, mediaId);
        expect(result).toEqual(comments);
    });

    it('should handle token validation failure', async () => {
        const errorMessage = 'Invalid token';
        mockValidateToken.mockRejectedValue(new Error(errorMessage)); // Simulate token validation failure

        await expect(executeResolver()).rejects.toThrow(errorMessage);
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token); // Check token validation
        expect(mockGetMediaCommentsByMediaId).not.toHaveBeenCalled(); // Ensure comments are not fetched
    });

    it('should handle database errors gracefully', async () => {
        const errorMessage = 'Database error';
        mockGetMediaCommentsByMediaId.mockRejectedValue(new Error(errorMessage)); // Simulate database error

        await expect(executeResolver()).rejects.toThrow(errorMessage);
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token); // Check token validation
        expect(mockGetMediaCommentsByMediaId).toHaveBeenCalledWith(db, mediaId);
    });
});
