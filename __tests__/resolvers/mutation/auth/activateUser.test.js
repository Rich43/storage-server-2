import activateUser from '../../../../src/resolvers/mutation/auth/activateUser.js';
import knex from 'knex';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

// Mock knex
jest.mock('knex');
const mockKnex = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    update: jest.fn(),
    fn: {
        now: jest.fn().mockReturnValue('2024-01-01T00:00:00Z')
    }
};

knex.mockReturnValue(mockKnex);

describe('activateUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should activate the user with a valid activation code', async () => {
        const user = {
            id: 1,
            activation_key: 'validCode'
        };

        mockKnex.first.mockResolvedValue(user);

        const result = await activateUser(null, { activationCode: 'validCode' }, { knex: mockKnex });

        expect(mockKnex.where).toHaveBeenCalledWith('activation_key', 'validCode');
        expect(mockKnex.first).toHaveBeenCalled();
        expect(mockKnex.update).toHaveBeenCalledWith({
            activated: true,
            activation_key: null,
            updated: '2024-01-01T00:00:00Z'
        });
        expect(result).toBe(true);
    });

    it('should return false if the activation code is invalid', async () => {
        mockKnex.first.mockResolvedValue(null);

        const result = await activateUser(null, { activationCode: 'invalidCode' }, { knex: mockKnex });

        expect(mockKnex.where).toHaveBeenCalledWith('activation_key', 'invalidCode');
        expect(mockKnex.first).toHaveBeenCalled();
        expect(mockKnex.update).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return false if there is an unexpected error', async () => {
        mockKnex.first.mockRejectedValue(new Error('Unexpected error'));

        const result = await activateUser(null, { activationCode: 'validCode' }, { knex: mockKnex });

        expect(mockKnex.where).toHaveBeenCalledWith('activation_key', 'validCode');
        expect(mockKnex.first).toHaveBeenCalled();
        expect(mockKnex.update).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});
