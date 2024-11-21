import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import deleteLikeDislike from '../../../../src/resolvers/mutation/delete/deleteLikeDislike';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetAnyLikeDislikeById = jest.fn();
const mockDeleteLikeDislike = jest.fn();

const db = {};
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    MediaLikesDislikes: {
        getAnyLikeDislikeById: mockGetAnyLikeDislikeById,
        deleteLikeDislike: mockDeleteLikeDislike,
    },
};
const utils = {};
const token = 'mock-token';

describe('deleteLikeDislike', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a like or dislike', async () => {
        const id = 1;
        const session = { userId: 1 };
        const record = { id, userId: 1 };

        mockValidateToken.mockResolvedValue(session);
        mockGetAnyLikeDislikeById.mockResolvedValue(record);
        mockDeleteLikeDislike.mockResolvedValue(true);

        const result = await deleteLikeDislike(null, { id }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetAnyLikeDislikeById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteLikeDislike).toHaveBeenCalledWith(db, id);
        expect(result).toBe(true);
    });

    it('should throw an error if record is not found', async () => {
        const id = 1;

        mockValidateToken.mockResolvedValue({ userId: 1 });
        mockGetAnyLikeDislikeById.mockResolvedValue(null);

        await expect(deleteLikeDislike(null, { id }, { db, model, utils, token })).rejects.toThrow('Record not found');
    });

    it('should throw an error if user is not authorized', async () => {
        const id = 1;
        const session = { userId: 2 };
        const record = { id, userId: 1 };

        mockValidateToken.mockResolvedValue(session);
        mockGetAnyLikeDislikeById.mockResolvedValue(record);

        await expect(deleteLikeDislike(null, { id }, { db, model, utils, token })).rejects.toThrow(
            'You are not authorized to delete this record'
        );
    });
});
