// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import refreshSession from '../../../../src/resolvers/mutation/auth/refreshSession';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockUuidv4 = jest.fn();
const mockGetDates = jest.fn();
const mockUpdateSessionWithNewTokenAndExpiryDate = jest.fn();
const mockGetUserById = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
        updateSessionWithNewTokenAndExpiryDate: mockUpdateSessionWithNewTokenAndExpiryDate,
    },
    User: {
        getUserById: mockGetUserById,
    },
};
const utils = {
    uuidv4: mockUuidv4,
    getDates: mockGetDates,
};
const token = 'mock-token'; // Mock token object

describe('refreshSession', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should refresh session successfully', async () => {
        const session = { id: 1, userId: 1 };
        const newSessionToken = 'new-unique-session-token';
        const sessionExpireDateTime = '2023-12-31T23:59:59.000Z';
        const sessionExpireDateTimeFormatted = '2023-12-31 23:59:59';
        const user = { id: 1, username: 'validUser', avatar: 'avatar.png', admin: true };

        mockValidateToken.mockResolvedValue(session);
        mockUuidv4.mockReturnValue(newSessionToken);
        mockGetDates.mockReturnValue({ sessionExpireDateTime, sessionExpireDateTimeFormatted });
        mockUpdateSessionWithNewTokenAndExpiryDate.mockResolvedValue(true);
        mockGetUserById.mockResolvedValue(user);

        const result = await refreshSession(null, null, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockUuidv4).toHaveBeenCalled();
        expect(mockGetDates).toHaveBeenCalled();
        expect(mockUpdateSessionWithNewTokenAndExpiryDate).toHaveBeenCalledWith(db, token, newSessionToken, sessionExpireDateTimeFormatted);
        expect(mockGetUserById).toHaveBeenCalledWith(db, session.userId);

        expect(result).toEqual({
            userId: user.id,
            sessionId: session.id,
            username: user.username,
            avatarPicture: user.avatar,
            sessionToken: newSessionToken,
            sessionExpireDateTime: sessionExpireDateTime,
            admin: user.admin,
        });
    });

    it('should handle errors during session validation', async () => {
        mockValidateToken.mockRejectedValue(new Error('Invalid token'));

        await expect(refreshSession(null, null, { db, model, utils, token })).rejects.toThrow('Invalid token');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockUuidv4).not.toHaveBeenCalled();
        expect(mockGetDates).not.toHaveBeenCalled();
        expect(mockUpdateSessionWithNewTokenAndExpiryDate).not.toHaveBeenCalled();
        expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it('should handle errors during user retrieval', async () => {
        const session = { id: 1, userId: 1 };
        const newSessionToken = 'new-unique-session-token';
        const sessionExpireDateTime = '2023-12-31T23:59:59.000Z';
        const sessionExpireDateTimeFormatted = '2023-12-31 23:59:59';

        mockValidateToken.mockResolvedValue(session);
        mockUuidv4.mockReturnValue(newSessionToken);
        mockGetDates.mockReturnValue({ sessionExpireDateTime, sessionExpireDateTimeFormatted });
        mockUpdateSessionWithNewTokenAndExpiryDate.mockResolvedValue(true);
        mockGetUserById.mockRejectedValue(new Error('User not found'));

        await expect(refreshSession(null, null, { db, model, utils, token })).rejects.toThrow('User not found');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockUuidv4).toHaveBeenCalled();
        expect(mockGetDates).toHaveBeenCalled();
        expect(mockUpdateSessionWithNewTokenAndExpiryDate).toHaveBeenCalledWith(db, token, newSessionToken, sessionExpireDateTimeFormatted);
        expect(mockGetUserById).toHaveBeenCalledWith(db, session.userId);
    });
});
