// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import logoutUser from '../../../../src/resolvers/mutation/auth/logoutUser';

// Mock dependencies
const mockDeleteSession = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        deleteSession: mockDeleteSession,
    },
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

describe('logoutUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log out user successfully', async () => {
        mockDeleteSession.mockResolvedValue(true);

        const result = await logoutUser(null, null, { db, model, utils, token });

        expect(mockDeleteSession).toHaveBeenCalledWith(db, token);
        expect(result).toBe(true);
    });

    it('should handle errors during session deletion', async () => {
        mockDeleteSession.mockRejectedValue(new Error('Database error'));

        await expect(logoutUser(null, null, { db, model, utils, token })).rejects.toThrow('Database error');

        expect(mockDeleteSession).toHaveBeenCalledWith(db, token);
    });
});
