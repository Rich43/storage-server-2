import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import editMediaComment from '../../../../src/resolvers/mutation/update/editMediaComment.js';

describe('editMediaComment', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            Session: {
                validateToken: jest.fn(),
            },
            User: {
                getUserFromToken: jest.fn(),
            },
            MediaComment: {
                getMediaCommentById: jest.fn(),
                updateMediaCommentById: jest.fn(),
            },
        };
        mockUtils = {
            moment: jest.fn().mockReturnValue({
                utc: jest.fn().mockReturnValue({
                    toISOString: jest.fn().mockReturnValue('2024-07-08T00:00:00.000Z'),
                }),
            }),
        };
        mockToken = 'mockToken';
    });

    it('should edit media comment successfully', async () => {
        const input = { id: 1, comment: 'Updated comment' };
        const user = { id: 1, name: 'Test User' };
        const existingComment = { id: 1, user_id: 1, comment: 'Original comment' };
        const updatedComment = { id: 1, user_id: 1, comment: 'Updated comment', updated: '2024-07-08T00:00:00.000Z' };

        mockModel.Session.validateToken.mockResolvedValue();
        mockModel.User.getUserFromToken.mockResolvedValue(user);
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(existingComment);
        mockModel.MediaComment.updateMediaCommentById.mockResolvedValue();
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(updatedComment);

        const result = await editMediaComment(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, mockUtils, mockToken);
        expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, mockToken);
        expect(mockModel.MediaComment.getMediaCommentById).toHaveBeenCalledWith(mockDb, input.id);
        expect(mockModel.MediaComment.updateMediaCommentById).toHaveBeenCalledWith(mockDb, input.id, {
            comment: input.comment,
            updated: '2024-07-08T00:00:00.000Z'
        });
        expect(result).toEqual(updatedComment);
    });

    it('should throw an error if comment is not found', async () => {
        const input = { id: 1, comment: 'Updated comment' };

        mockModel.Session.validateToken.mockResolvedValue();
        mockModel.User.getUserFromToken.mockResolvedValue({ id: 1 });
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(null);

        await expect(editMediaComment(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Comment not found');
    });

    it('should throw an error if user is not authorized to edit comment', async () => {
        const input = { id: 1, comment: 'Updated comment' };
        const user = { id: 1, name: 'Test User' };
        const existingComment = { id: 1, user_id: 2, comment: 'Original comment' };

        mockModel.Session.validateToken.mockResolvedValue();
        mockModel.User.getUserFromToken.mockResolvedValue(user);
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(existingComment);

        await expect(editMediaComment(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Not authorized to edit this comment');
    });

    it('should handle unexpected errors', async () => {
        const input = { id: 1, comment: 'Updated comment' };
        const errorMessage = 'Unexpected error';

        mockModel.Session.validateToken.mockRejectedValue(new Error(errorMessage));

        await expect(editMediaComment(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow(errorMessage);
    });
});
