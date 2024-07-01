// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import editMediaComment from '../../../src/resolvers/mutation/editMediaComment';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaCommentById = jest.fn();
const mockUpdateMediaCommentById = jest.fn();

const db = {
    fn: {
        now: jest.fn()
    }
}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    MediaComment: {
        getMediaCommentById: mockGetMediaCommentById,
        updateMediaCommentById: mockUpdateMediaCommentById,
    }
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

const commonMocks = (user, comment) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaCommentById.mockResolvedValue(comment);
    db.fn.now.mockReturnValue(new Date());
};

describe('editMediaComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should edit comment successfully', async () => {
        const input = { id: 1, comment: 'New Comment' };
        const user = { id: 1 };
        const existingComment = { id: 1, user_id: 1, comment: 'Old Comment' };
        const updatedComment = { id: 1, user_id: 1, comment: 'New Comment', updated: new Date() };

        commonMocks(user, existingComment);
        mockUpdateMediaCommentById.mockResolvedValue(true);
        mockGetMediaCommentById.mockResolvedValueOnce(existingComment).mockResolvedValueOnce(updatedComment);

        const result = await editMediaComment(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, input.id);
        expect(mockUpdateMediaCommentById).toHaveBeenCalledWith(db, input.id, {
            comment: input.comment,
            updated: expect.any(Date)
        });
        expect(result).toEqual(updatedComment);
    });

    it('should throw an error if comment not found', async () => {
        const input = { id: 1, comment: 'New Comment' };
        const user = { id: 1 };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaCommentById.mockResolvedValue(null);

        await expect(editMediaComment(null, { input }, { db, model, utils, token })).rejects.toThrow('Comment not found');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, input.id);
        expect(mockUpdateMediaCommentById).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not authorized to edit the comment', async () => {
        const input = { id: 1, comment: 'New Comment' };
        const user = { id: 2 };
        const existingComment = { id: 1, user_id: 1, comment: 'Old Comment' };

        commonMocks(user, existingComment);

        await expect(editMediaComment(null, { input }, { db, model, utils, token })).rejects.toThrow('Not authorized to edit this comment');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, input.id);
        expect(mockUpdateMediaCommentById).not.toHaveBeenCalled();
    });
});
