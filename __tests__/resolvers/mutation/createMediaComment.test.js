import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import createMediaComment from '../../../src/resolvers/mutation/createMediaComment';
import {
    db,
    mockGetUserFromToken,
    mockInsertMediaComment,
    mockValidateToken,
    model,
    token,
    utils
} from '../commonMocks';

describe('createMediaComment', () => {
    const input = { mediaId: 1, comment: 'Great media!' };
    const user = { id: 1, name: 'Test User' };
    const newComment = {
        mediaId: input.mediaId,
        userId: user.id,
        comment: input.comment,
        created: '2023-07-12T00:00:00.000Z',
        updated: '2023-07-12T00:00:00.000Z'
    };
    const insertedComment = { ...newComment, id: 1 };

    const setupCreateMediaCommentMocks = () => {
        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockInsertMediaComment.mockResolvedValue(insertedComment);
        utils.moment = jest.fn(() => ({
            utc: () => ({
                toISOString: () => '2023-07-12T00:00:00.000Z'
            })
        }));
    };

    const assertCreateMediaCommentMocks = async (result, error = null) => {
        if (error) {
            await expect(result).rejects.toThrow(error);
        } else {
            await expect(result).resolves.toEqual(insertedComment);
            expect(mockInsertMediaComment).toHaveBeenCalledWith(db, expect.objectContaining(newComment));
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, utils, token);
        if (error !== 'Invalid session token') {
            expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        setupCreateMediaCommentMocks();
    });

    it('should create media comment successfully', async () => {
        const result = createMediaComment(null, { input }, { db, model, utils, token });
        await assertCreateMediaCommentMocks(result);
    });

    it('should throw an error if session token is invalid', async () => {
        mockValidateToken.mockRejectedValue(new Error('Invalid session token'));
        const result = createMediaComment(null, { input }, { db, model, utils, token });
        await assertCreateMediaCommentMocks(result, 'Invalid session token');
    });

    it('should throw an error if user not found', async () => {
        mockGetUserFromToken.mockRejectedValue(new Error('User not found'));
        const result = createMediaComment(null, { input }, { db, model, utils, token });
        await assertCreateMediaCommentMocks(result, 'User not found');
    });

    it('should throw an error if inserting comment fails', async () => {
        mockInsertMediaComment.mockRejectedValue(new Error('Failed to insert comment'));
        const result = createMediaComment(null, { input }, { db, model, utils, token });
        await assertCreateMediaCommentMocks(result, 'Failed to insert comment');
    });
});
