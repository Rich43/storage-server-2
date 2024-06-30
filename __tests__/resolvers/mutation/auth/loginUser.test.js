import loginUser from '../../../../src/resolvers/mutation/auth/loginUser.js';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

// Mock knex instance and methods
const mockWhere = jest.fn().mockReturnThis();
const mockFirst = jest.fn();
const mockUpdate = jest.fn();

const mockKnex = jest.fn().mockImplementation(() => ({
    where: mockWhere,
    first: mockFirst,
    update: mockUpdate
}));

mockKnex.fn = {
    now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
};

describe('loginUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log in the user with valid credentials', async () => {
        const user = {
            id: 1,
            email: 'richard@example.com'
        };

        mockFirst.mockResolvedValue(user);

        const result = await loginUser(null, { username: 'richard', password: 'password' }, { db: mockKnex });

    })

});