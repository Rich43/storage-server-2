// noinspection JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import loginUser from '../../../../src/resolvers/mutation/auth/loginUser';

// Mock dependencies
const mockHashPassword = jest.fn();
const mockValidateUser = jest.fn();
const mockUuidv4 = jest.fn();
const mockGetDates = jest.fn();
const mockCreateSession = jest.fn();
const mockGetSessionById = jest.fn();

const db = {}; // Mock database object
const model = {
    User: {
        validateUser: mockValidateUser,
    },
    Session: {
        createSession: mockCreateSession,
        getSessionById: mockGetSessionById,
    },
};
const utils = {
    hashPassword: mockHashPassword,
    uuidv4: mockUuidv4,
    getDates: mockGetDates,
};
const token = {}; // Mock token object if needed

describe('loginUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log in user successfully with valid username and password', async () => {
        const username = 'validUser';
        const password = 'validPassword';
        const hashedPassword = 'hashedPassword';
        const user = { id: 1, username: 'validUser', avatar: 'avatar.png', admin: true };
        const sessionToken = 'unique-session-token';
        const sessionExpireDateTime = '2023-12-31T23:59:59.000Z';
        const sessionExpireDateTimeFormatted = '2023-12-31 23:59:59';
        const session = { id: 1, sessionToken };

        mockHashPassword.mockReturnValue(hashedPassword);
        mockValidateUser.mockResolvedValue(user);
        mockUuidv4.mockReturnValue(sessionToken);
        mockGetDates.mockReturnValue({ sessionExpireDateTime, sessionExpireDateTimeFormatted });
        mockCreateSession.mockResolvedValue(session.id);
        mockGetSessionById.mockResolvedValue(session);

        const result = await loginUser(null, { username, password }, { db, model, utils, token });

        expect(mockHashPassword).toHaveBeenCalledWith(password);
        expect(mockValidateUser).toHaveBeenCalledWith(db, username, hashedPassword);
        expect(mockUuidv4).toHaveBeenCalled();
        expect(mockGetDates).toHaveBeenCalled();
        expect(mockCreateSession).toHaveBeenCalledWith(db, user.id, sessionToken, sessionExpireDateTimeFormatted);
        expect(mockGetSessionById).toHaveBeenCalledWith(db, session.id);

        expect(result).toEqual({
            userId: user.id,
            sessionId: session.id,
            username: user.username,
            avatarPicture: user.avatar,
            sessionToken: session.sessionToken,
            sessionExpireDateTime: sessionExpireDateTime,
            admin: user.admin,
        });
    });

    it('should throw an error for invalid username or password', async () => {
        const username = 'invalidUser';
        const password = 'invalidPassword';
        const hashedPassword = 'hashedInvalidPassword';

        mockHashPassword.mockReturnValue(hashedPassword);
        mockValidateUser.mockResolvedValue(null);

        await expect(loginUser(null, { username, password }, { db, model, utils, token })).rejects.toThrow('Invalid username or password');

        expect(mockHashPassword).toHaveBeenCalledWith(password);
        expect(mockValidateUser).toHaveBeenCalledWith(db, username, hashedPassword);
        expect(mockUuidv4).not.toHaveBeenCalled();
        expect(mockGetDates).not.toHaveBeenCalled();
        expect(mockCreateSession).not.toHaveBeenCalled();
        expect(mockGetSessionById).not.toHaveBeenCalled();
    });

    it('should handle errors during session creation', async () => {
        const username = 'validUser';
        const password = 'validPassword';
        const hashedPassword = 'hashedPassword';
        const user = { id: 1, username: 'validUser', avatar: 'avatar.png', admin: true };
        const sessionToken = 'unique-session-token';
        const sessionExpireDateTime = '2023-12-31T23:59:59.000Z';
        const sessionExpireDateTimeFormatted = '2023-12-31 23:59:59';

        mockHashPassword.mockReturnValue(hashedPassword);
        mockValidateUser.mockResolvedValue(user);
        mockUuidv4.mockReturnValue(sessionToken);
        mockGetDates.mockReturnValue({ sessionExpireDateTime, sessionExpireDateTimeFormatted });
        mockCreateSession.mockRejectedValue(new Error('Database error'));

        await expect(loginUser(null, { username, password }, { db, model, utils, token })).rejects.toThrow('Database error');

        expect(mockHashPassword).toHaveBeenCalledWith(password);
        expect(mockValidateUser).toHaveBeenCalledWith(db, username, hashedPassword);
        expect(mockUuidv4).toHaveBeenCalled();
        expect(mockGetDates).toHaveBeenCalled();
        expect(mockCreateSession).toHaveBeenCalledWith(db, user.id, sessionToken, sessionExpireDateTimeFormatted);
        expect(mockGetSessionById).not.toHaveBeenCalled();
    });
});
