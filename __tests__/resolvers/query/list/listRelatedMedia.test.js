import listRelatedMedia from '../../../../src/resolvers/query/list/listRelatedMedia.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';
import natural from 'natural';
import { removeStopwords } from 'stopword';

// Mock dependencies
jest.mock('knex');
jest.mock('natural');
jest.mock('stopword');

// Mock knex
const mockDb = {
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    first: jest.fn()
};

// Mock functions
const tokenizerMock = {
    tokenize: jest.fn()
};
natural.WordTokenizer.mockImplementation(() => tokenizerMock);
removeStopwords.mockImplementation(tokens => tokens);

describe('listRelatedMedia', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully retrieve related media', async () => {
        const id = 1;
        const media = {
            id: 1,
            title: 'Test Media',
            description: 'This is a test media description.'
        };

        const keywords = ['test', 'media', 'description'];

        const relatedMedia = [
            { id: 2, title: 'Related Media 1', description: 'Description of related media 1' },
            { id: 3, title: 'Related Media 2', description: 'Description of related media 2' }
        ];

        mockDb.first.mockResolvedValueOnce(media);
        tokenizerMock.tokenize.mockReturnValueOnce(['test', 'media', 'description']);
        mockDb.where.mockResolvedValueOnce(relatedMedia);

        const result = await listRelatedMedia(null, { id }, { knex: mockDb });

        expect(mockDb.where).toHaveBeenCalledWith('id', id);
        expect(mockDb.first).toHaveBeenCalled();
        expect(tokenizerMock.tokenize).toHaveBeenCalledWith('test media this is a test media description.');
        expect(removeStopwords).toHaveBeenCalledWith(['test', 'media', 'description']);
        expect(mockDb.where).toHaveBeenCalledWith('id', '!=', id);
        keywords.forEach(keyword => {
            expect(mockDb.orWhere).toHaveBeenCalledWith('title', 'like', `%${keyword}%`);
            expect(mockDb.orWhere).toHaveBeenCalledWith('description', 'like', `%${keyword}%`);
        });
        expect(result).toEqual(relatedMedia);
    });

    it('should throw an error if the media is not found', async () => {
        const id = 1;

        mockDb.first.mockResolvedValueOnce(null);

        await expect(listRelatedMedia(null, { id }, { knex: mockDb }))
            .rejects
            .toThrow('Media not found');

        expect(mockDb.where).toHaveBeenCalledWith('id', id);
        expect(mockDb.first).toHaveBeenCalled();
        expect(tokenizerMock.tokenize).not.toHaveBeenCalled();
        expect(removeStopwords).not.toHaveBeenCalled();
        expect(mockDb.orWhere).not.toHaveBeenCalled();
    });

    it('should handle errors during related media retrieval', async () => {
        const id = 1;

        mockDb.first.mockRejectedValueOnce(new Error('Database error'));

        await expect(listRelatedMedia(null, { id }, { knex: mockDb }))
            .rejects
            .toThrow('Failed to list related media');

        expect(mockDb.where).toHaveBeenCalledWith('id', id);
        expect(mockDb.first).toHaveBeenCalled();
        expect(tokenizerMock.tokenize).not.toHaveBeenCalled();
        expect(removeStopwords).not.toHaveBeenCalled();
        expect(mockDb.orWhere).not.toHaveBeenCalled();
    });
});
