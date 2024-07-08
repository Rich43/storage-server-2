import { describe, expect, it, jest } from '@jest/globals';
import { getAllAlbums, filterAlbum } from '../../../src/resolvers/model/Album';

describe('Album.js tests', () => {
    let mockDb;
    let mockQuery;

    beforeEach(() => {
        mockQuery = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis()
        };
        mockDb = jest.fn().mockReturnValue(mockQuery);
    });

    describe('getAllAlbums', () => {
        it('should retrieve all albums from the database', async () => {
            const result = getAllAlbums(mockDb);

            expect(mockDb).toHaveBeenCalledWith('Album');
            expect(mockQuery.select).toHaveBeenCalledWith('*');
            expect(result).toBe(mockQuery);
        });
    });

    describe('filterAlbum', () => {
        it('should apply title filter to the album query', () => {
            const filter = { title: 'example' };
            const result = filterAlbum(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Album.title', 'like', `%example%`);
            expect(result).toBe(mockQuery);
        });

        it('should apply userId filter to the album query', () => {
            const filter = { userId: 123 };
            const result = filterAlbum(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Album.userId', 123);
            expect(result).toBe(mockQuery);
        });

        it('should apply multiple filters to the album query', () => {
            const filter = { title: 'example', userId: 123 };
            const result = filterAlbum(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Album.title', 'like', `%example%`);
            expect(mockQuery.where).toHaveBeenCalledWith('Album.userId', 123);
            expect(result).toBe(mockQuery);
        });

        it('should not apply any filter if filter is empty', () => {
            const filter = {};
            const result = filterAlbum(filter, mockQuery);

            expect(mockQuery.where).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });

        it('should handle undefined filter', () => {
            const filter = undefined;
            const result = filterAlbum(filter, mockQuery);

            expect(mockQuery.where).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });
    });
});
