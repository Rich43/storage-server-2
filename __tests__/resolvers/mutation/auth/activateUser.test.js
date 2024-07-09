// noinspection JSCheckFunctionSignatures

import activateUser from '../../../../src/resolvers/mutation/auth/activateUser';
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe('activateUser', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            User: {
                findActivationKey: jest.fn(),
                updateActivationKey: jest.fn(),
            },
        };
        mockUtils = {};
        mockToken = 'mockToken';
    });

    it('should activate user successfully with a valid activation code', async () => {
        const activationCode = 'valid-activation-code';
        const user = { id: 1, username: 'testuser' };

        mockModel.User.findActivationKey.mockResolvedValue(user);
        mockModel.User.updateActivationKey.mockResolvedValue();

        const result = await activateUser(null, { activationCode }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.User.findActivationKey).toHaveBeenCalledWith(mockDb, activationCode);
        expect(mockModel.User.updateActivationKey).toHaveBeenCalledWith(mockDb, mockUtils, user.id);
        expect(result).toBe(true);
    });

    it('should return false if activation code is invalid', async () => {
        const activationCode = 'invalid-activation-code';

        mockModel.User.findActivationKey.mockResolvedValue(null);

        const result = await activateUser(null, { activationCode }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.User.findActivationKey).toHaveBeenCalledWith(mockDb, activationCode);
        expect(mockModel.User.updateActivationKey).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return false if updating activation key fails', async () => {
        const activationCode = 'valid-activation-code';
        const user = { id: 1, username: 'testuser' };

        mockModel.User.findActivationKey.mockResolvedValue(user);
        mockModel.User.updateActivationKey.mockRejectedValue(new Error('Update failed'));

        const result = await activateUser(null, { activationCode }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.User.findActivationKey).toHaveBeenCalledWith(mockDb, activationCode);
        expect(mockModel.User.updateActivationKey).toHaveBeenCalledWith(mockDb, mockUtils, user.id);
        expect(result).toBe(false);
    });
});
