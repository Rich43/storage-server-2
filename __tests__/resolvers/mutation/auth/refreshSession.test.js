// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import refreshSession from '../../../../src/resolvers/mutation/auth/refreshSession';

describe('refreshSession', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            Session: {
                validateToken: jest.fn(),
                updateSessionWithNewTokenAndExpiryDate: jest.fn(),
            },
            User: {
                getUserById: jest.fn(),
            },
        };
        mockUtils = {
            uuidv4: jest.fn().mockReturnValue('new-unique-token'),
            getDates: jest.fn().mockReturnValue({
                sessionExpireDateTime: '2024-07-08T00:00:00.000Z',
                sessionExpireDateTimeFormatted: '2024-07-08T00:00:00.000Z',
            }),
        };
        mockToken = 'mockToken';
    });

    it('should refresh session successfully', async () => {
        const session = { id: 'sessionId', userId: 'userId' };
        const user = {
            id: 'userId',
            username: 'testuser',
            avatar: 'avatar.png',
            admin: true,
        };

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Session.updateSessionWithNewTokenAndExpiryDate.mockResolvedValue();
        mockModel.User.getUserById.mockResolvedValue(user);

        const result = await refreshSession(null, null, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, mockUtils, mockToken);
        expect(mockUtils.uuidv4).toHaveBeenCalled();
        expect(mockUtils.getDates).toHaveBeenCalled();
        expect(mockModel.Session.updateSessionWithNewTokenAndExpiryDate).toHaveBeenCalledWith(
            mockDb,
            mockUtils,
            mockToken,
            'new-unique-token',
            '2024-07-08T00:00:00.000Z'
        );
        expect(mockModel.User.getUserById).toHaveBeenCalledWith(mockDb, session.userId);
        expect(result).toEqual({
            userId: user.id,
            sessionId: session.id,
            username: user.username,
            avatarPicture: user.avatar,
            sessionToken: 'new-unique-token',
            sessionExpireDateTime: '2024-07-08T00:00:00.000Z',
            admin: user.admin,
        });
    });

    it('should throw an error if session validation fails', async () => {
        mockModel.Session.validateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(refreshSession(null, null, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Invalid token');
    });

    it('should throw an error if session update fails', async () => {
        const session = { id: 'sessionId', userId: 'userId' };

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Session.updateSessionWithNewTokenAndExpiryDate.mockRejectedValue(new Error('Update failed'));

        await expect(refreshSession(null, null, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('Update failed');
    });

    it('should throw an error if user retrieval fails', async () => {
        const session = { id: 'sessionId', userId: 'userId' };

        mockModel.Session.validateToken.mockResolvedValue(session);
        mockModel.Session.updateSessionWithNewTokenAndExpiryDate.mockResolvedValue();
        mockModel.User.getUserById.mockRejectedValue(new Error('User not found'));

        await expect(refreshSession(null, null, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('User not found');
    });
});
