import moment from 'moment';
import crypto from 'crypto';
import {
    getDates,
    hashPassword,
    validateToken,
    getUserFromToken,
    getMediaQuery,
    performFilter,
    performPagination,
    performSorting
} from '../../src/resolvers/utils/utils.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock dependencies
jest.mock('moment');
jest.mock('crypto');

// Mock moment
const now = '2024-01-01T00:00:00Z';
moment.mockReturnValue({
    add: jest.fn().mockReturnThis(),
    utc: jest.fn().mockReturnThis(),
    toISOString: jest.fn().mockReturnValue(now),
    format: jest.fn().mockReturnValue(now)
});

// Mock knex
const mockDb = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    join: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis()
};

describe('utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDates', () => {
        it('should return correct dates', () => {
            const { sessionExpireDateTime, sessionExpireDateTimeFormatted } = getDates();

            expect(sessionExpireDateTime).toBe(now);
            expect(sessionExpireDateTimeFormatted).toBe(now);
            expect(moment().add).toHaveBeenCalledWith(1, 'hour');
            expect(moment().utc().format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss');
        });
    });

    describe('hashPassword', () => {
        it('should hash the password correctly', () => {
            const password = 'password123';
            const hashedPassword = 'hashedpassword';
            crypto.createHash.mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue(hashedPassword)
            });

            const result = hashPassword(password);

            expect(result).toBe(hashedPassword);
            expect(crypto.createHash).toHaveBeenCalledWith('sha3-512');
            expect(crypto.createHash().update).toHaveBeenCalledWith(password);
            expect(crypto.createHash().digest).toHaveBeenCalledWith('hex');
        });
    });

    describe('validateToken', () => {
        it('should validate the token correctly', async () => {
            const token = 'mock-token';
            const session = { sessionExpireDateTime: now };
            mockDb.first.mockResolvedValueOnce(session);

            const result = await validateToken(mockDb, token);

            expect(result).toBe(session);
            expect(mockDb.where).toHaveBeenCalledWith({ sessionToken: token });
            expect(mockDb.first).toHaveBeenCalled();
            expect(moment().utc().format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss');
        });

        it('should throw an error if the token is invalid', async () => {
            const token = 'invalid-token';
            mockDb.first.mockResolvedValueOnce(null);

            await expect(validateToken(mockDb, token)).rejects.toThrow('Invalid session token');

            expect(mockDb.where).toHaveBeenCalledWith({ sessionToken: token });
            expect(mockDb.first).toHaveBeenCalled();
        });

        it('should throw an error if the token has expired', async () => {
            const token = 'expired-token';
            const session = { sessionExpireDateTime: '2023-12-31T23:59:59Z' };
            mockDb.first.mockResolvedValueOnce(session);

            await expect(validateToken(mockDb, token)).rejects.toThrow('Session token has expired');

            expect(mockDb.where).toHaveBeenCalledWith({ sessionToken: token });
            expect(mockDb.first).toHaveBeenCalled();
            expect(moment().utc().format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss');
        });
    });

    describe('getUserFromToken', () => {
        it('should return the user correctly', async () => {
            const token = 'mock-token';
            const user = { admin: true };
            mockDb.first.mockResolvedValueOnce(user);

            const result = await getUserFromToken(mockDb, token);

            expect(result).toBe(user);
            expect(mockDb.join).toHaveBeenCalledWith('Session', 'User.id', 'Session.userId');
            expect(mockDb.select).toHaveBeenCalledWith('User.admin');
            expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
            expect(mockDb.first).toHaveBeenCalled();
        });

        it('should throw an error if the user is not found', async () => {
            const token = 'invalid-token';
            mockDb.first.mockResolvedValueOnce(null);

            await expect(getUserFromToken(mockDb, token)).rejects.toThrow('User not found');

            expect(mockDb.join).toHaveBeenCalledWith('Session', 'User.id', 'Session.userId');
            expect(mockDb.select).toHaveBeenCalledWith('User.admin');
            expect(mockDb.where).toHaveBeenCalledWith('Session.sessionToken', token);
            expect(mockDb.first).toHaveBeenCalled();
        });
    });

    describe('getMediaQuery', () => {
        it('should return media query correctly for non-admin user', () => {
            const user = { admin: false };
            const category = 'VIDEO';

            const result = getMediaQuery(mockDb, user, category);

            expect(result).toBe(mockDb);
            expect(mockDb.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id');
            expect(mockDb.where).toHaveBeenCalledWith('Mimetype.category', category);
            expect(mockDb.select).toHaveBeenCalledWith('Media.*', 'Mimetype.type as mimetype');
            expect(mockDb.where).toHaveBeenCalledWith('Media.adminOnly', false);
        });

        it('should return media query correctly for admin user', () => {
            const user = { admin: true };
            const category = 'VIDEO';

            const result = getMediaQuery(mockDb, user, category);

            expect(result).toBe(mockDb);
            expect(mockDb.join).toHaveBeenCalledWith('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id');
            expect(mockDb.where).toHaveBeenCalledWith('Mimetype.category', category);
            expect(mockDb.select).toHaveBeenCalledWith('Media.*', 'Mimetype.type as mimetype');
            expect(mockDb.where).not.toHaveBeenCalledWith('Media.adminOnly', false);
        });
    });

    describe('performFilter', () => {
        it('should apply filters correctly', () => {
            const filter = { title: 'test', mimetype: 'image/jpeg', userId: 1 };

            const result = performFilter(filter, mockDb);

            expect(result).toBe(mockDb);
            expect(mockDb.where).toHaveBeenCalledWith('Media.title', 'like', '%test%');
            expect(mockDb.where).toHaveBeenCalledWith('Mimetype.type', filter.mimetype);
            expect(mockDb.where).toHaveBeenCalledWith('Media.userId', filter.userId);
        });

        it('should return the original query if no filter is applied', () => {
            const filter = null;

            const result = performFilter(filter, mockDb);

            expect(result).toBe(mockDb);
            expect(mockDb.where).not.toHaveBeenCalled();
        });
    });

    describe('performPagination', () => {
        it('should apply pagination correctly', () => {
            const pagination = { page: 2, limit: 10 };

            const result = performPagination(pagination, mockDb);

            expect(result).toBe(mockDb);
            expect(mockDb.limit).toHaveBeenCalledWith(10);
            expect(mockDb.offset).toHaveBeenCalledWith(10); // (page - 1) * limit = (2 - 1) * 10 = 10
        });

        it('should return the original query if no pagination is applied', () => {
            const pagination = null;

            const result = performPagination(pagination, mockDb);

            expect(result).toBe(mockDb);
            expect(mockDb.limit).not.toHaveBeenCalled();
            expect(mockDb.offset).not.toHaveBeenCalled();
        });
    });

    describe('performSorting', () => {
        it('should apply sorting correctly', () => {
            const sorting = { field: 'title', order: 'asc' };

            const result = performSorting(sorting, mockDb);

            expect(result).toBe(mockDb);
            expect(mockDb.orderBy).toHaveBeenCalledWith('title', 'asc');
        });

        it('should return the original query if no sorting is applied', () => {
            const sorting = null;

            const result = performSorting(sorting, mockDb);

            expect(result).toBe(mockDb);
            expect(mockDb.orderBy).not.toHaveBeenCalled();
        });
    });
});
