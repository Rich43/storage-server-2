import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import deleteMediaComment from '../../../src/resolvers/mutation/deleteMediaComment';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaCommentById = jest.fn();
const mockDeleteMediaCommentById = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    MediaComment: {
        getMediaCommentById: mockGetMediaCommentById,
        deleteMediaCommentById: mockDeleteMediaCommentById,
    },
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

describe('deleteMediaComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete comment successfully for the owner', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const comment = { id, user_id: 1 };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaCommentById.mockResolvedValue(comment);
        mockDeleteMediaCommentById.mockResolvedValue(true);

        const result = await deleteMediaComment(null, { id }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaCommentById).toHaveBeenCalledWith(db, id);
        expect(result).toBe(true);
    });

    it('should throw an error if comment not found', async () => {
        const id = 1;
        const user = { id: 1, admin: false };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaCommentById.mockResolvedValue(null);

        await expect(deleteMediaComment(null, { id }, { db, model, utils, token })).rejects.toThrow('Comment not found');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaCommentById).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not authorized to delete the comment', async () => {
        const id = 1;
        const user = { id: 2, admin: false };
        const comment = { id, user_id: 1 };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaCommentById.mockResolvedValue(comment);

        await expect(deleteMediaComment(null, { id }, { db, model, utils, token })).rejects.toThrow('Not authorized to delete this comment');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaCommentById).not.toHaveBeenCalled();
    });

    it('should delete comment successfully for an admin', async () => {
        const id = 1;
        const user = { id: 2, admin: true };
        const comment = { id, user_id: 1 };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaCommentById.mockResolvedValue(comment);
        mockDeleteMediaCommentById.mockResolvedValue(true);

        const result = await deleteMediaComment(null, { id }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaCommentById).toHaveBeenCalledWith(db, id);
        expect(result).toBe(true);
    });
});
