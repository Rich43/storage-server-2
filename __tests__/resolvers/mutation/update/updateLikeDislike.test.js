import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import updateLikeDislike from '../../../../src/resolvers/mutation/update/updateLikeDislike';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetAnyLikeDislikeById = jest.fn();
const mockUpdateLikeDislike = jest.fn();

const db = {};
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    MediaLikesDislikes: {
        getAnyLikeDislikeById: mockGetAnyLikeDislikeById,
        updateLikeDislike: mockUpdateLikeDislike,
    },
};
const utils = {};
const token = 'mock-token';

describe('updateLikeDislike', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a like or dislike', async () => {
        const input = { id: 1, action: 'DISLIKE' };
        const session = { userId: 1 };
        const record = { id: input.id, userId: 1 };

        mockValidateToken.mockResolvedValue(session);
        mockGetAnyLikeDislikeById.mockResolvedValue(record);
        mockUpdateLikeDislike.mockResolvedValue(true);

        const result = await updateLikeDislike(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetAnyLikeDislikeById).toHaveBeenCalledWith(db, input.id);
        expect(mockUpdateLikeDislike).toHaveBeenCalledWith(db, input.id, { action: input.action });
        expect(result).toBe(true);
    });

    it('should throw an error if record is not found', async () => {
        const input = { id: 1, action: 'DISLIKE' };

        mockValidateToken.mockResolvedValue({ userId: 1 });
        mockGetAnyLikeDislikeById.mockResolvedValue(null);

        await expect(updateLikeDislike(null, { input }, { db, model, utils, token })).rejects.toThrow('Record not found');
    });

    it('should throw an error if user is not authorized', async () => {
        const input = { id: 1, action: 'DISLIKE' };
        const session = { userId: 2 };
        const record = { id: input.id, userId: 1 };

        mockValidateToken.mockResolvedValue(session);
        mockGetAnyLikeDislikeById.mockResolvedValue(record);

        await expect(updateLikeDislike(null, { input }, { db, model, utils, token })).rejects.toThrow(
            'You are not authorized to update this record'
        );
    });
});
