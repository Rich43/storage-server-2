import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import getDislikesByUser from '../../../../src/resolvers/query/get/getDislikesByUser';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetDislikesByUserId = jest.fn();

const db = {};
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    MediaLikesDislikes: {
        getDislikesByUserId: mockGetDislikesByUserId,
    },
};
const utils = {};
const token = 'mock-token';

describe('getDislikesByUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return dislikes for the user', async () => {
        const dislikes = [{ id: 1, mediaId: 10, action: 'DISLIKE' }];
        mockValidateToken.mockResolvedValue({ userId: 1 });
        mockGetDislikesByUserId.mockResolvedValue(dislikes);

        const result = await getDislikesByUser(null, {}, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetDislikesByUserId).toHaveBeenCalledWith(db, 1);
        expect(result).toEqual(dislikes);
    });

    it('should throw an error if token validation fails', async () => {
        mockValidateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(getDislikesByUser(null, {}, { db, model, utils, token })).rejects.toThrow('Invalid token');
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetDislikesByUserId).not.toHaveBeenCalled();
    });
});
