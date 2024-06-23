import setAvatar from '../../../../src/resolvers/mutation/auth/setAvatar.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock knex
jest.mock('knex');
const mockKnex = {
    join: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    first: jest.fn(),
    update: jest.fn(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

knex.mockReturnValue(mockKnex);

describe('setAvatar', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully update the user\'s avatar', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            avatar: null
        };

        const media = {
            id: 1,
            mimetype_id: 1,
            category: 'IMAGE'
        };

        const updatedUser = {
            id: 1,
            username: 'testuser',
            avatar: 1,
            updated: '2024-01-01T00:00:00Z'
        };

        mockKnex.first.mockResolvedValueOnce(media).mockResolvedValueOnce(updatedUser);

        const result = await setAvatar(null, { mediaId: 1 }, { knex: mockKnex, user });

        expect(mockKnex.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetype_id', 'Mimetype.id');
        expect(mockKnex.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockKnex.andWhere).toHaveBeenCalledWith('Mimetype.category', 'IMAGE');
        expect(mockKnex.update).toHaveBeenCalledWith({
            avatar: 1,
            updated: '2024-01-01T00:00:00Z'
        });
        expect(result).toEqual(updatedUser);
    });

    it('should throw an error if the user is not authenticated', async () => {
        await expect(setAvatar(null, { mediaId: 1 }, { knex: mockKnex, user: null }))
            .rejects
            .toThrow('Not authenticated');

        expect(mockKnex.join).not.toHaveBeenCalled();
        expect(mockKnex.where).not.toHaveBeenCalled();
        expect(mockKnex.andWhere).not.toHaveBeenCalled();
        expect(mockKnex.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the media is not of image mime type category', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            avatar: null
        };

        mockKnex.first.mockResolvedValueOnce(null);

        await expect(setAvatar(null, { mediaId: 1 }, { knex: mockKnex, user }))
            .rejects
            .toThrow('Media must have image mime type category');

        expect(mockKnex.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetype_id', 'Mimetype.id');
        expect(mockKnex.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockKnex.andWhere).toHaveBeenCalledWith('Mimetype.category', 'IMAGE');
        expect(mockKnex.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the avatar update fails', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            avatar: null
        };

        const media = {
            id: 1,
            mimetype_id: 1,
            category: 'IMAGE'
        };

        mockKnex.first.mockResolvedValueOnce(media);
        mockKnex.update.mockRejectedValueOnce(new Error('Database error'));

        await expect(setAvatar(null, { mediaId: 1 }, { knex: mockKnex, user }))
            .rejects
            .toThrow('Failed to set avatar');

        expect(mockKnex.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetype_id', 'Mimetype.id');
        expect(mockKnex.where).toHaveBeenCalledWith('Media.id', 1);
        expect(mockKnex.andWhere).toHaveBeenCalledWith('Mimetype.category', 'IMAGE');
        expect(mockKnex.update).toHaveBeenCalled();
    });
});
