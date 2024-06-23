import loginUser from '../../../../src/resolvers/mutation/auth/loginUser.js';
import { v4 as uuidv4 } from 'uuid';
import { getDates, hashPassword } from '../../../../src/resolvers/utils.js';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('uuid');
jest.mock('../../../../src/resolvers/utils.js');
jest.mock('knex');

// Mock knex
const mockDb = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

// Mock functions
uuidv4.mockReturnValue('mock-session-token');
getDates.mockReturnValue({
    sessionExpireDateTime: '2024-01-01T00:00:00Z',
    sessionExpireDateTimeFormatted: '2024-01-01 00:00:00'
});
hashPassword.mockImplementation((password) => `hashed-${password}`);

describe('loginUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully log in the user', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            password: 'hashed-password',
            avatar: 'avatar.png',
            admin: false
        };

        const session = {
            id: 1,
            sessionToken: 'mock-session-token',
            sessionExpireDateTime: '2024-01-01T00:00:00Z'
        };

        mockDb.first.mockResolvedValueOnce(user).mockResolvedValueOnce(session);
        mockDb.insert.mockResolvedValueOnce([1]);

        const result = await loginUser(null, { username: 'testuser', password: 'password' }, { db: mockDb });

        expect(hashPassword).toHaveBeenCalledWith('password');
        expect(mockDb.where).toHaveBeenCalledWith({ username: 'testuser', password: 'hashed-password' });
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.insert).toHaveBeenCalledWith({
            userId: user.id,
            sessionToken: 'mock-session-token',
            sessionExpireDateTime: '2024-01-01 00:00:00',
            created: '2024-01-01T00:00:00Z'
        });
        expect(mockDb.returning).toHaveBeenCalledWith('id');
        expect(result).toEqual({
            userId: user.id,
            sessionId: session.id,
            username: user.username,
            avatarPicture: user.avatar,
            sessionToken: session.sessionToken,
            sessionExpireDateTime: '2024-01-01T00:00:00Z',
            admin: user.admin
        });
    });

    it('should throw an error if the username or password is invalid', async () => {
        mockDb.first.mockResolvedValueOnce(null);

        await expect(loginUser(null, { username: 'invaliduser', password: 'password' }, { db: mockDb }))
            .rejects
            .toThrow('Invalid username or password');

        expect(hashPassword).toHaveBeenCalledWith('password');
        expect(mockDb.where).toHaveBeenCalledWith({ username: 'invaliduser', password: 'hashed-password' });
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it('should throw an error if session creation fails', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            password: 'hashed-password',
            avatar: 'avatar.png',
            admin: false
        };

        mockDb.first.mockResolvedValueOnce(user);
        mockDb.insert.mockRejectedValueOnce(new Error('Session creation failed'));

        await expect(loginUser(null, { username: 'testuser', password: 'password' }, { db: mockDb }))
            .rejects
            .toThrow('Session creation failed');

        expect(hashPassword).toHaveBeenCalledWith('password');
        expect(mockDb.where).toHaveBeenCalledWith({ username: 'testuser', password: 'hashed-password' });
        expect(mockDb.first).toHaveBeenCalled();
        expect(mockDb.insert).toHaveBeenCalled();
    });
});
