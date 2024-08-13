// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import editUser from '../../../../src/resolvers/mutation/auth/editUser.js';

describe('editUser Resolver', () => {
    let dbMock, modelMock, utilsMock, tokenMock, parentMock;

    beforeEach(() => {
        dbMock = jest.fn();
        modelMock = {
            Session: {
                validateToken: jest.fn(),
            },
            User: {
                getUserFromToken: jest.fn(),
                updateUser: jest.fn(),
            },
        };
        utilsMock = jest.fn();
        tokenMock = 'someValidToken';
        parentMock = {};
    });

    it('should successfully update the user when user is authorized', async () => {
        const input = { id: 1, name: 'New Name', email: 'newemail@example.com' };
        const userFromToken = { id: 1, admin: false };

        modelMock.Session.validateToken.mockResolvedValue(true);
        modelMock.User.getUserFromToken.mockResolvedValue(userFromToken);
        modelMock.User.updateUser.mockResolvedValue(true);
        dbMock.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ id: 1, name: 'New Name', email: 'newemail@example.com' }),
        });

        const result = await editUser(parentMock, { input }, { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock });

        expect(modelMock.Session.validateToken).toHaveBeenCalledWith(dbMock, utilsMock, tokenMock);
        expect(modelMock.User.getUserFromToken).toHaveBeenCalledWith(tokenMock);
        expect(modelMock.User.updateUser).toHaveBeenCalledWith(dbMock, utilsMock, 1, { name: 'New Name', email: 'newemail@example.com' });
        expect(result).toEqual({ id: 1, name: 'New Name', email: 'newemail@example.com' });
    });

    it('should throw an error if the user is not authorized', async () => {
        const input = { id: 2, name: 'New Name', email: 'newemail@example.com' };
        const userFromToken = { id: 1, admin: false };

        modelMock.Session.validateToken.mockResolvedValue(true);
        modelMock.User.getUserFromToken.mockResolvedValue(userFromToken);

        await expect(editUser(parentMock, { input }, { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock }))
            .rejects
            .toThrow('Unauthorized');

        expect(modelMock.Session.validateToken).toHaveBeenCalledWith(dbMock, utilsMock, tokenMock);
        expect(modelMock.User.getUserFromToken).toHaveBeenCalledWith(tokenMock);
        expect(modelMock.User.updateUser).not.toHaveBeenCalled();
    });

    it('should throw an error if the token is invalid', async () => {
        const input = { id: 1, name: 'New Name', email: 'newemail@example.com' };

        modelMock.Session.validateToken.mockRejectedValue(new Error('Invalid Token'));

        await expect(editUser(parentMock, { input }, { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock }))
            .rejects
            .toThrow('Invalid Token');

        expect(modelMock.Session.validateToken).toHaveBeenCalledWith(dbMock, utilsMock, tokenMock);
        expect(modelMock.User.getUserFromToken).not.toHaveBeenCalled();
        expect(modelMock.User.updateUser).not.toHaveBeenCalled();
    });

    it('should throw an error if db throws an error during the update', async () => {
        const input = { id: 1, name: 'New Name', email: 'newemail@example.com' };
        const userFromToken = { id: 1, admin: false };

        modelMock.Session.validateToken.mockResolvedValue(true);
        modelMock.User.getUserFromToken.mockResolvedValue(userFromToken);
        modelMock.User.updateUser.mockRejectedValue(new Error('Database Error'));

        await expect(editUser(parentMock, { input }, { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock }))
            .rejects
            .toThrow('Database Error');

        expect(modelMock.Session.validateToken).toHaveBeenCalledWith(dbMock, utilsMock, tokenMock);
        expect(modelMock.User.getUserFromToken).toHaveBeenCalledWith(tokenMock);
        expect(modelMock.User.updateUser).toHaveBeenCalledWith(dbMock, utilsMock, 1, { name: 'New Name', email: 'newemail@example.com' });
    });

    it('should allow an admin to update any user', async () => {
        const input = { id: 2, name: 'New Name', email: 'newemail@example.com' };
        const userFromToken = { id: 1, admin: true };

        modelMock.Session.validateToken.mockResolvedValue(true);
        modelMock.User.getUserFromToken.mockResolvedValue(userFromToken);
        modelMock.User.updateUser.mockResolvedValue(true);
        dbMock.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ id: 2, name: 'New Name', email: 'newemail@example.com' }),
        });

        const result = await editUser(parentMock, { input }, { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock });

        expect(modelMock.Session.validateToken).toHaveBeenCalledWith(dbMock, utilsMock, tokenMock);
        expect(modelMock.User.getUserFromToken).toHaveBeenCalledWith(tokenMock);
        expect(modelMock.User.updateUser).toHaveBeenCalledWith(dbMock, utilsMock, 2, { name: 'New Name', email: 'newemail@example.com' });
        expect(result).toEqual({ id: 2, name: 'New Name', email: 'newemail@example.com' });
    });
});
