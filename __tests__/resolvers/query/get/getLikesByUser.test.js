import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import getLikesByUser from '../../../../src/resolvers/query/get/getLikesByUser';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetLikesByUserId = jest.fn();

const db = {};
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    MediaLikesDislikes: {
        getLikesByUserId: mockGetLikesByUserId,
    },
};
const utils = {};
const token = 'mock-token';

describe('getLikesByUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return likes for the user', async () => {
        const likes = [{ id: 1, mediaId: 10, action: 'LIKE' }];
        mockValidateToken.mockResolvedValue({ userId: 1 });
        mockGetLikesByUserId.mockResolvedValue(likes);

        const result = await getLikesByUser(null, {}, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetLikesByUserId).toHaveBeenCalledWith(db, 1);
        expect(result).toEqual(likes);
    });

    it('should throw an error if token validation fails', async () => {
        mockValidateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(getLikesByUser(null, {}, { db, model, utils, token })).rejects.toThrow('Invalid token');
        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        expect(mockGetLikesByUserId).not.toHaveBeenCalled();
    });
});
