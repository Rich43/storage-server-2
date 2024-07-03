import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import editMediaComment from '../../../src/resolvers/mutation/editMediaComment';
import moment from 'moment';

jest.mock('moment');

describe('editMediaComment unit tests', () => {
    let mockDb, mockModel, mockUtils, context;
    const fixedTimestamp = '2024-07-03T22:06:19.869Z';

    beforeEach(() => {
        mockDb = {};
        mockModel = {
            Session: {
                validateToken: jest.fn()
            },
            User: {
                getUserFromToken: jest.fn()
            },
            MediaComment: {
                getMediaCommentById: jest.fn(),
                updateMediaCommentById: jest.fn()
            }
        };
        mockUtils = {
            moment: jest.fn(() => moment(fixedTimestamp))
        };
        context = {
            db: mockDb,
            model: mockModel,
            utils: mockUtils,
            token: 'validtoken'
        };
    });

    it('should edit a media comment successfully', async () => {
        const input = {
            id: 1,
            comment: 'Updated comment'
        };

        const user = { id: 1 };
        const existingComment = { id: 1, user_id: 1, comment: 'Original comment' };
        const updatedComment = {
            comment: input.comment,
            updated: fixedTimestamp
        };

        mockModel.Session.validateToken.mockResolvedValue(true);
        mockModel.User.getUserFromToken.mockResolvedValue(user);
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(existingComment);
        mockModel.MediaComment.updateMediaCommentById.mockResolvedValue(null);
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue({ ...existingComment, ...updatedComment });

        const result = await editMediaComment(null, { input }, context);

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.MediaComment.getMediaCommentById).toHaveBeenCalledWith(mockDb, input.id);
        expect(mockModel.MediaComment.updateMediaCommentById).toHaveBeenCalledWith(mockDb, input.id, updatedComment);
        expect(result).toEqual({ ...existingComment, ...updatedComment });
    });

    it('should throw an error if comment does not exist', async () => {
        const input = {
            id: 1,
            comment: 'Updated comment'
        };

        mockModel.Session.validateToken.mockResolvedValue(true);
        mockModel.User.getUserFromToken.mockResolvedValue({ id: 1 });
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(null);

        await expect(editMediaComment(null, { input }, context)).rejects.toThrow('Comment not found');

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.MediaComment.getMediaCommentById).toHaveBeenCalledWith(mockDb, input.id);
        expect(mockModel.MediaComment.updateMediaCommentById).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not authorized to edit the comment', async () => {
        const input = {
            id: 1,
            comment: 'Updated comment'
        };

        const user = { id: 1 };
        const existingComment = { id: 1, user_id: 2, comment: 'Original comment' };

        mockModel.Session.validateToken.mockResolvedValue(true);
        mockModel.User.getUserFromToken.mockResolvedValue(user);
        mockModel.MediaComment.getMediaCommentById.mockResolvedValue(existingComment);

        await expect(editMediaComment(null, { input }, context)).rejects.toThrow('Not authorized to edit this comment');

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.MediaComment.getMediaCommentById).toHaveBeenCalledWith(mockDb, input.id);
        expect(mockModel.MediaComment.updateMediaCommentById).not.toHaveBeenCalled();
    });

    it('should throw an error if token validation fails', async () => {
        const input = {
            id: 1,
            comment: 'Updated comment'
        };

        mockModel.Session.validateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(editMediaComment(null, { input }, context)).rejects.toThrow('Invalid token');

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.User.getUserFromToken).not.toHaveBeenCalled();
        expect(mockModel.MediaComment.getMediaCommentById).not.toHaveBeenCalled();
        expect(mockModel.MediaComment.updateMediaCommentById).not.toHaveBeenCalled();
    });
});
