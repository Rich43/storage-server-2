// noinspection JSCheckFunctionSignatures,JSIgnoredPromiseFromCall

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import deleteMediaComment from '../../../../src/resolvers/mutation/delete/deleteMediaComment.js';

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
    }
};
const utils = {}; // Mock utils object
const token = 'mock-token'; // Mock token object

const setupMocks = (isValidToken, user, comment) => {
    mockValidateToken.mockResolvedValue(isValidToken ? {} : Promise.reject(new Error('Invalid session token')));
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaCommentById.mockResolvedValue(comment);
    mockDeleteMediaCommentById.mockResolvedValue(true);
};

const assertCommonMocks = async (result, user, comment, id, error = null) => {
    if (error) {
        await expect(result).rejects.toThrow(error);
    } else {
        await expect(result).resolves.toEqual(true);
    }

    expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
    if (error !== 'Invalid session token') {
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaCommentById).toHaveBeenCalledWith(db, id);
        if (!error) {
            expect(mockDeleteMediaCommentById).toHaveBeenCalledWith(db, id);
        } else {
            expect(mockDeleteMediaCommentById).not.toHaveBeenCalled();
        }
    } else {
        expect(mockGetUserFromToken).not.toHaveBeenCalled();
        expect(mockGetMediaCommentById).not.toHaveBeenCalled();
        expect(mockDeleteMediaCommentById).not.toHaveBeenCalled();
    }
};

describe('deleteMediaComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete the comment successfully', async () => {
        const id = 1;
        const user = { id: 1, admin: false };
        const comment = { id, user_id: 1, content: 'Test comment' };

        setupMocks(true, user, comment);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, comment, id);
    });

    it('should delete the comment successfully for admin user', async () => {
        const id = 1;
        const user = { id: 2, admin: true };
        const comment = { id, user_id: 1, content: 'Test comment' };

        setupMocks(true, user, comment);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, comment, id);
    });

    it('should throw an error if comment not found', async () => {
        const id = 1;
        const user = { id: 1, admin: false };

        setupMocks(true, user, null);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, null, id, 'Comment not found');
    });

    it('should throw an error if user is not authorized to delete the comment', async () => {
        const id = 1;
        const user = { id: 2, admin: false };
        const comment = { id, user_id: 1, content: 'Test comment' };

        setupMocks(true, user, comment);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, user, comment, id, 'Not authorized to delete this comment');
    });

    it('should handle invalid session token', async () => {
        const id = 1;

        setupMocks(false, null, null);

        const result = deleteMediaComment(null, { id }, { db, model, utils, token });

        await assertCommonMocks(result, null, null, id, 'Invalid session token');
    });
});
