import { describe, expect, it, jest } from '@jest/globals';
import { getMediaKeywords, performFilter, performPagination, performSorting } from '../../../src/resolvers/utils/mediaUtils';

describe('mediaUtils.js integration tests', () => {
    describe('getMediaKeywords', () => {
        it('should return the correct keywords from media', () => {
            const media = {
                title: "A Sample Title",
                description: "This is a description of the media content."
            };

            const keywords = getMediaKeywords(media);

            expect(keywords).toEqual(["sample", "title", "description", "media", "content"]);
        });

        it('should handle empty title and description', () => {
            const media = {
                title: "",
                description: ""
            };

            const keywords = getMediaKeywords(media);

            expect(keywords).toEqual([]);
        });

        it('should handle undefined title and description', () => {
            const media = {};

            const keywords = getMediaKeywords(media);

            expect(keywords).toEqual([]);
        });
    });

    describe('performFilter', () => {
        it('should apply title filter to the query', () => {
            const filter = { title: "example" };
            const mockQuery = {
                where: jest.fn().mockReturnThis()
            };

            const result = performFilter(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Media.title', 'like', `%example%`);
            expect(result).toBe(mockQuery);
        });

        it('should apply mimetype filter to the query', () => {
            const filter = { mimetype: "image/png" };
            const mockQuery = {
                where: jest.fn().mockReturnThis()
            };

            const result = performFilter(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Mimetype.type', 'image/png');
            expect(result).toBe(mockQuery);
        });

        it('should apply userId filter to the query', () => {
            const filter = { userId: 123 };
            const mockQuery = {
                where: jest.fn().mockReturnThis()
            };

            const result = performFilter(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Media.userId', 123);
            expect(result).toBe(mockQuery);
        });

        it('should apply multiple filters to the query', () => {
            const filter = { title: "example", mimetype: "image/png", userId: 123 };
            const mockQuery = {
                where: jest.fn().mockReturnThis()
            };

            const result = performFilter(filter, mockQuery);

            expect(mockQuery.where).toHaveBeenCalledWith('Media.title', 'like', `%example%`);
            expect(mockQuery.where).toHaveBeenCalledWith('Mimetype.type', 'image/png');
            expect(mockQuery.where).toHaveBeenCalledWith('Media.userId', 123);
            expect(result).toBe(mockQuery);
        });

        it('should not apply any filter if filter is empty', () => {
            const filter = {};
            const mockQuery = {
                where: jest.fn().mockReturnThis()
            };

            const result = performFilter(filter, mockQuery);

            expect(mockQuery.where).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });

        it('should handle undefined filter', () => {
            const filter = undefined;
            const mockQuery = {
                where: jest.fn().mockReturnThis()
            };

            const result = performFilter(filter, mockQuery);

            expect(mockQuery.where).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });
    });

    describe('performPagination', () => {
        it('should apply pagination to the query', () => {
            const pagination = { page: 2, limit: 10 };
            const mockQuery = {
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis()
            };

            const result = performPagination(pagination, mockQuery);

            expect(mockQuery.limit).toHaveBeenCalledWith(10);
            expect(mockQuery.offset).toHaveBeenCalledWith(10);
            expect(result).toBe(mockQuery);
        });

        it('should not apply pagination if pagination is empty', () => {
            const pagination = {};
            const mockQuery = {
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis()
            };

            const result = performPagination(pagination, mockQuery);

            expect(mockQuery.limit).not.toHaveBeenCalled();
            expect(mockQuery.offset).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });

        it('should not apply pagination if pagination is undefined', () => {
            const pagination = undefined;
            const mockQuery = {
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis()
            };

            const result = performPagination(pagination, mockQuery);

            expect(mockQuery.limit).not.toHaveBeenCalled();
            expect(mockQuery.offset).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });

        it('should not apply pagination if page or limit is undefined', () => {
            const pagination = { page: undefined, limit: undefined };
            const mockQuery = {
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis()
            };

            const result = performPagination(pagination, mockQuery);

            expect(mockQuery.limit).not.toHaveBeenCalled();
            expect(mockQuery.offset).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });
    });

    describe('performSorting', () => {
        it('should apply sorting to the query', () => {
            const sorting = { field: "title", order: "asc" };
            const mockQuery = {
                orderBy: jest.fn().mockReturnThis()
            };

            const result = performSorting(sorting, mockQuery);

            expect(mockQuery.orderBy).toHaveBeenCalledWith("title", "asc");
            expect(result).toBe(mockQuery);
        });

        it('should not apply sorting if sorting is empty', () => {
            const sorting = {};
            const mockQuery = {
                orderBy: jest.fn().mockReturnThis()
            };

            const result = performSorting(sorting, mockQuery);

            expect(mockQuery.orderBy).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });

        it('should not apply sorting if sorting is undefined', () => {
            const sorting = undefined;
            const mockQuery = {
                orderBy: jest.fn().mockReturnThis()
            };

            const result = performSorting(sorting, mockQuery);

            expect(mockQuery.orderBy).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });

        it('should not apply sorting if field or order is undefined', () => {
            const sorting = { field: undefined, order: undefined };
            const mockQuery = {
                orderBy: jest.fn().mockReturnThis()
            };

            const result = performSorting(sorting, mockQuery);

            expect(mockQuery.orderBy).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });
    });
});
