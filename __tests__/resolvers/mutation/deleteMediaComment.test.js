// noinspection JSCheckFunctionSignatures,JSIgnoredPromiseFromCall

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

const setupMocks = (user, comment) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaCommentById.mockResolvedValue(comment);
};

const assertCommon = async (result, user, comment, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toBe(true);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, token);
    expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
    expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, comment.id);

    if (!error) {
        expect(mockDeleteMediaCommentById).toHaveBeenCalledWith(db, comment.id);
    } else {
        expect(mockDeleteMediaCommentById).not.toHaveBeenCalled();
    }
};

describe('deleteMediaComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete comment successfully for the owner', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const comment = { id, user_id: 1 };

        setupMocks(user, comment);
        mockDeleteMediaCommentById.mockResolvedValue(true);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommon(result, user, comment);
    });

    it('should throw an error if comment not found', async () => {
        const id = 1;
        const user = { id: 1, admin: false };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaCommentById.mockResolvedValue(null);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommon(result, user, { id }, 'Comment not found');
    });

    it('should throw an error if user is not authorized to delete the comment', async () => {
        const id = 1;
        const user = { id: 2, admin: false };
        const comment = { id, user_id: 1 };

        setupMocks(user, comment);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommon(result, user, comment, 'Not authorized to delete this comment');
    });

    it('should delete comment successfully for an admin', async () => {
        const id = 1;
        const user = { id: 2, admin: true };
        const comment = { id, user_id: 1 };

        setupMocks(user, comment);
        mockDeleteMediaCommentById.mockResolvedValue(true);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommon(result, user, comment);
    });
});
