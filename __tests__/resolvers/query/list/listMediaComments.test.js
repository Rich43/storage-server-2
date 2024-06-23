import listMediaComments from '../../../../src/resolvers/query/list/listMediaComments.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock knex
jest.mock('knex');

// Mock knex instance
const mockDb = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    first: jest.fn()
};

describe('listMediaComments', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully list comments for a given media ID', async () => {
        const mediaId = 1;
        const comments = [
            { id: 1, media_id: 1, comment: 'First comment', user_id: 1 },
            { id: 2, media_id: 1, comment: 'Second comment', user_id: 2 }
        ];

        mockDb.where.mockResolvedValueOnce(comments);

        const result = await listMediaComments(null, { mediaId }, { db: mockDb });

        expect(mockDb.where).toHaveBeenCalledWith('media_id', mediaId);
        expect(result).toEqual(comments);
    });

    it('should return an empty array if no comments exist for the given media ID', async () => {
        const mediaId = 1;
        const comments = [];

        mockDb.where.mockResolvedValueOnce(comments);

        const result = await listMediaComments(null, { mediaId }, { db: mockDb });

        expect(mockDb.where).toHaveBeenCalledWith('media_id', mediaId);
        expect(result).toEqual(comments);
    });

    it('should handle errors during comment retrieval', async () => {
        const mediaId = 1;

        mockDb.where.mockRejectedValueOnce(new Error('Database error'));

        await expect(listMediaComments(null, { mediaId }, { db: mockDb }))
            .rejects
            .toThrow('Database error');

        expect(mockDb.where).toHaveBeenCalledWith('media_id', mediaId);
    });
});
