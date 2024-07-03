import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import createMediaComment from '../../../src/resolvers/mutation/createMediaComment';
import moment from 'moment';

jest.mock('moment');

describe('createMediaComment unit tests', () => {
    let mockDb, mockModel, mockUtils, context;
    const fixedTimestamp = '2024-07-03T22:06:19.869Z';

    beforeEach(() => {
        mockDb = {};
        mockModel = {
            MediaComment: {
                insertMediaComment: jest.fn()
            }
        };
        mockUtils = {
            validateToken: jest.fn(),
            getUserFromToken: jest.fn(),
            moment: jest.fn(() => moment(fixedTimestamp))
        };
        context = {
            db: mockDb,
            model: mockModel,
            utils: mockUtils,
            token: 'validtoken'
        };
    });

    it('should create a media comment', async () => {
        const input = {
            mediaId: 1,
            comment: 'This is a test comment'
        };

        const user = { id: 1 };
        const newComment = {
            mediaId: input.mediaId,
            userId: user.id,
            comment: input.comment,
            created: fixedTimestamp,
            updated: fixedTimestamp
        };

        const insertedComment = { ...newComment, id: 1 };

        mockUtils.validateToken.mockResolvedValue(true);
        mockUtils.getUserFromToken.mockResolvedValue(user);
        mockModel.MediaComment.insertMediaComment.mockResolvedValue(insertedComment);

        const result = await createMediaComment(null, { input }, context);

        expect(mockUtils.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockUtils.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.MediaComment.insertMediaComment).toHaveBeenCalledWith(mockDb, newComment);
        expect(result).toEqual(insertedComment);
    });

    it('should throw an error if token validation fails', async () => {
        const input = {
            mediaId: 1,
            comment: 'This is a test comment'
        };

        mockUtils.validateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(createMediaComment(null, { input }, context)).rejects.toThrow('Invalid token');

        expect(mockUtils.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockUtils.getUserFromToken).not.toHaveBeenCalled();
        expect(mockModel.MediaComment.insertMediaComment).not.toHaveBeenCalled();
    });

    it('should throw an error if user retrieval fails', async () => {
        const input = {
            mediaId: 1,
            comment: 'This is a test comment'
        };

        mockUtils.validateToken.mockResolvedValue(true);
        mockUtils.getUserFromToken.mockRejectedValue(new Error('User not found'));

        await expect(createMediaComment(null, { input }, context)).rejects.toThrow('User not found');

        expect(mockUtils.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockUtils.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.MediaComment.insertMediaComment).not.toHaveBeenCalled();
    });

    it('should throw an error if media comment insertion fails', async () => {
        const input = {
            mediaId: 1,
            comment: 'This is a test comment'
        };

        const user = { id: 1 };
        const newComment = {
            mediaId: input.mediaId,
            userId: user.id,
            comment: input.comment,
            created: fixedTimestamp,
            updated: fixedTimestamp
        };

        mockUtils.validateToken.mockResolvedValue(true);
        mockUtils.getUserFromToken.mockResolvedValue(user);
        mockModel.MediaComment.insertMediaComment.mockRejectedValue(new Error('Insertion failed'));

        await expect(createMediaComment(null, { input }, context)).rejects.toThrow('Insertion failed');

        expect(mockUtils.validateToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockUtils.getUserFromToken).toHaveBeenCalledWith(mockDb, 'validtoken');
        expect(mockModel.MediaComment.insertMediaComment).toHaveBeenCalledWith(mockDb, newComment);
    });
});
