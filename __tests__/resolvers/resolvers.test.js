import resolvers from '../../src/resolvers/index';
import { getDislikeCountByMediaId, getLikeCountByMediaId } from '../../src/resolvers/model/MediaLikesDislikes';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../src/resolvers/model/MediaLikesDislikes', () => ({
    getLikeCountByMediaId: jest.fn(),
    getDislikeCountByMediaId: jest.fn()
}));

describe('Media Resolvers', () => {
    let db;
    let model;

    beforeEach(() => {
        db = {};  // Initialize this with any necessary mock database setup if required
        model = {
            MediaLikesDislikes: {
                getLikeCountByMediaId,
                getDislikeCountByMediaId,
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('likes resolver', () => {
        it('should return the correct like count', async () => {
            const parent = { id: 1 };
            getLikeCountByMediaId.mockResolvedValue(5);  // Mock the return value of the function

            const result = await resolvers.Media.likes(parent, null, { db, model });
            expect(result).toBe(5);
            expect(getLikeCountByMediaId).toHaveBeenCalledWith(db, parent.id);
        });

        it('should return 0 if parent or model is not provided', async () => {
            const result = await resolvers.Media.likes(null, null, { db, model });
            expect(result).toBe(0);
        });
    });

    describe('dislikes resolver', () => {
        it('should return the correct dislike count', async () => {
            const parent = { id: 1 };
            getDislikeCountByMediaId.mockResolvedValue(3);  // Mock the return value of the function

            const result = await resolvers.Media.dislikes(parent, null, { db, model });
            expect(result).toBe(3);
            expect(getDislikeCountByMediaId).toHaveBeenCalledWith(db, parent.id);
        });

        it('should return 0 if parent or model is not provided', async () => {
            const result = await resolvers.Media.dislikes(null, null, { db, model });
            expect(result).toBe(0);
        });
    });
});
