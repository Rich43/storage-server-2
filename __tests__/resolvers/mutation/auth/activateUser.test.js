import activateUser from '../../../../src/resolvers/mutation/auth/activateUser.js';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

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

describe('activateUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should activate the user with a valid activation code', async () => {
        const user = {
            id: 1,
            activation_key: 'validCode'
        };

        mockFirst.mockResolvedValue(user);

        const result = await activateUser(null, { activationCode: 'validCode' }, { knex: mockKnex });

        expect(mockKnex).toHaveBeenCalledWith('User');
        expect(mockWhere).toHaveBeenCalledWith('activation_key', 'validCode');
        expect(mockFirst).toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledWith({
            activated: true,
            activation_key: null,
            updated: '2024-01-01T00:00:00Z'
        });
        expect(result).toBe(true);
    });

    it('should return false if the activation code is invalid', async () => {
        mockFirst.mockResolvedValue(null);

        const result = await activateUser(null, { activationCode: 'invalidCode' }, { knex: mockKnex });

        expect(mockKnex).toHaveBeenCalledWith('User');
        expect(mockWhere).toHaveBeenCalledWith('activation_key', 'invalidCode');
        expect(mockFirst).toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return false if there is an unexpected error', async () => {
        mockFirst.mockRejectedValue(new Error('Unexpected error'));

        const result = await activateUser(null, { activationCode: 'validCode' }, { knex: mockKnex });

        expect(mockKnex).toHaveBeenCalledWith('User');
        expect(mockWhere).toHaveBeenCalledWith('activation_key', 'validCode');
        expect(mockFirst).toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});
