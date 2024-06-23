import registerUser from '../../../../src/resolvers/mutation/auth/registerUser.js';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../../../src/resolvers/utils.js';
import knex from 'knex';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock dependencies
jest.mock('uuid');
jest.mock('../../../../src/resolvers/utils.js');
jest.mock('knex');

// Mock knex
const mockKnex = {
    select: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

// Mock functions
uuidv4.mockReturnValue('mock-activation-key');
hashPassword.mockImplementation((password) => `hashed-${password}`);

describe('registerUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully register the first user as admin and activated', async () => {
        const input = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password'
        };

        const newUser = {
            id: 1,
            username: 'testuser',
            password: 'hashed-password',
            admin: true,
            created: '2024-01-01T00:00:00Z',
            avatar: null,
            activated: true,
            activation_key: 'mock-activation-key',
            banned: false,
            updated: '2024-01-01T00:00:00Z'
        };

        mockKnex.count.mockResolvedValueOnce([{ count: 0 }]);
        mockKnex.returning.mockResolvedValueOnce([newUser]);

        const result = await registerUser(null, { input }, { knex: mockKnex });

        expect(hashPassword).toHaveBeenCalledWith('password');
        expect(mockKnex.count).toHaveBeenCalledWith('id as count');
        expect(mockKnex.insert).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'hashed-password',
            admin: true,
            created: '2024-01-01T00:00:00Z',
            avatar: null,
            activated: true,
            activation_key: 'mock-activation-key',
            banned: false,
            updated: '2024-01-01T00:00:00Z'
        });
        expect(mockKnex.returning).toHaveBeenCalledWith('*');
        expect(result).toEqual(newUser);
    });

    it('should successfully register a subsequent user as non-admin and not activated', async () => {
        const input = {
            username: 'testuser2',
            email: 'testuser2@example.com',
            password: 'password'
        };

        const newUser = {
            id: 2,
            username: 'testuser2',
            password: 'hashed-password',
            admin: false,
            created: '2024-01-01T00:00:00Z',
            avatar: null,
            activated: false,
            activation_key: 'mock-activation-key',
            banned: false,
            updated: '2024-01-01T00:00:00Z'
        };

        mockKnex.count.mockResolvedValueOnce([{ count: 1 }]);
        mockKnex.returning.mockResolvedValueOnce([newUser]);

        const result = await registerUser(null, { input }, { knex: mockKnex });

        expect(hashPassword).toHaveBeenCalledWith('password');
        expect(mockKnex.count).toHaveBeenCalledWith('id as count');
        expect(mockKnex.insert).toHaveBeenCalledWith({
            username: 'testuser2',
            password: 'hashed-password',
            admin: false,
            created: '2024-01-01T00:00:00Z',
            avatar: null,
            activated: false,
            activation_key: 'mock-activation-key',
            banned: false,
            updated: '2024-01-01T00:00:00Z'
        });
        expect(mockKnex.returning).toHaveBeenCalledWith('*');
        expect(result).toEqual(newUser);
    });

    it('should handle database insertion errors', async () => {
        const input = {
            username: 'testuser3',
            email: 'testuser3@example.com',
            password: 'password'
        };

        mockKnex.count.mockResolvedValueOnce([{ count: 1 }]);
        mockKnex.returning.mockRejectedValueOnce(new Error('Database error'));

        await expect(registerUser(null, { input }, { knex: mockKnex }))
            .rejects
            .toThrow('Database error');

        expect(hashPassword).toHaveBeenCalledWith('password');
        expect(mockKnex.count).toHaveBeenCalledWith('id as count');
        expect(mockKnex.insert).toHaveBeenCalled();
        expect(mockKnex.returning).toHaveBeenCalledWith('*');
    });
});
