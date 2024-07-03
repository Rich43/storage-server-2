import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import createMediaComment from '../../../src/resolvers/mutation/createMediaComment';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockInsertMediaComment = jest.fn();
const mockNow = jest.fn();

const db = {
    fn: {
        now: mockNow
    }
}; // Mock database object
const model = {
    MediaComment: {
        insertMediaComment: mockInsertMediaComment,
    },
};
const utils = {
    validateToken: mockValidateToken,
    getUserFromToken: mockGetUserFromToken,
};
const token = 'mock-token'; // Mock token object

describe('createMediaComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create media comment successfully', async () => {
        const input = { mediaId: 1, comment: 'This is a test comment' };
        const user = { id: 1, username: 'testUser' };
        const now = new Date();
        const insertedComment = {
            id: 1,
            mediaId: input.mediaId,
            userId: user.id,
            comment: input.comment,
            created: now,
            updated: now
        };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockNow.mockReturnValue(now);
        mockInsertMediaComment.mockResolvedValue(insertedComment);

        const result = await createMediaComment(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockNow).toHaveBeenCalledTimes(2);
        expect(mockInsertMediaComment).toHaveBeenCalledWith(db, {
            mediaId: input.mediaId,
            userId: user.id,
            comment: input.comment,
            created: now,
            updated: now
        });
        expect(result).toEqual(insertedComment);
    });

    it('should handle errors during comment creation', async () => {
        const input = { mediaId: 1, comment: 'This is a test comment' };
        const user = { id: 1, username: 'testUser' };
        const now = new Date();

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockNow.mockReturnValue(now);
        mockInsertMediaComment.mockRejectedValue(new Error('Database error'));

        await expect(createMediaComment(null, { input }, { db, model, utils, token })).rejects.toThrow('Database error');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockNow).toHaveBeenCalledTimes(2);
        expect(mockInsertMediaComment).toHaveBeenCalledWith(db, {
            mediaId: input.mediaId,
            userId: user.id,
            comment: input.comment,
            created: now,
            updated: now
        });
    });
});