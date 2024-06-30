// noinspection JSCheckFunctionSignatures

import activateUser from '../../../../src/resolvers/mutation/auth/activateUser';
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock dependencies
const mockFindActivationKey = jest.fn();
const mockUpdateActivationKey = jest.fn();

const db = {}; // Mock database object
const model = {
    User: {
        findActivationKey: mockFindActivationKey,
        updateActivationKey: mockUpdateActivationKey,
    },
};
const utils = {}; // Mock utilities object if needed
const token = {}; // Mock token object if needed

describe('activateUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should activate user successfully with valid activation code', async () => {
        const activationCode = 'valid-code';
        const user = { id: 1 };

        mockFindActivationKey.mockResolvedValue(user);
        mockUpdateActivationKey.mockResolvedValue(true);

        const result = await activateUser(null, { activationCode }, { db, model, utils, token });

        expect(mockFindActivationKey).toHaveBeenCalledWith(db, activationCode);
        expect(mockUpdateActivationKey).toHaveBeenCalledWith(db, user.id);
        expect(result).toBe(true);
    });

    it('should return false for invalid activation code', async () => {
        const activationCode = 'invalid-code';

        mockFindActivationKey.mockResolvedValue(null);

        const result = await activateUser(null, { activationCode }, { db, model, utils, token });

        expect(mockFindActivationKey).toHaveBeenCalledWith(db, activationCode);
        expect(mockUpdateActivationKey).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return false and log error if updateActivationKey throws an error', async () => {
        const activationCode = 'valid-code';
        const user = { id: 1 };

        mockFindActivationKey.mockResolvedValue(user);
        mockUpdateActivationKey.mockRejectedValue(new Error('Database error'));

        console.error = jest.fn();

        const result = await activateUser(null, { activationCode }, { db, model, utils, token });

        expect(mockFindActivationKey).toHaveBeenCalledWith(db, activationCode);
        expect(mockUpdateActivationKey).toHaveBeenCalledWith(db, user.id);
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith(new Error('Database error'));
    });
});
