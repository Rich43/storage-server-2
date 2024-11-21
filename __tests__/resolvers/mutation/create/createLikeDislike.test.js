import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import createLikeDislike from '../../../../src/resolvers/mutation/create/createLikeDislike';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockCreateLikeDislike = jest.fn();

const db = {};
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    MediaLikesDislikes: {
        createLikeDislike: mockCreateLikeDislike,
    },
};
const utils = {};
const token = 'mock-token';

describe('createLikeDislike', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a like or dislike', async () => {
        const input = { mediaId: 10, action: 'LIKE' };
        const createdRecord = { id: 1, ...input };

        mockValidateToken.mockResolvedValue(true);
        mockCreateLikeDislike.mockResolvedValue(createdRecord);

        const result = await createLikeDislike(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockCreateLikeDislike).toHaveBeenCalledWith(db, input);
        expect(result).toEqual(createdRecord);
    });

    it('should throw an error if token validation fails', async () => {
        mockValidateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(createLikeDislike(null, {}, { db, model, utils, token })).rejects.toThrow('Invalid token');
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockCreateLikeDislike).not.toHaveBeenCalled();
    });
});
