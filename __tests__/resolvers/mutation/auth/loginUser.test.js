import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import loginUser from '../../../../src/resolvers/mutation/auth/loginUser';

describe('loginUser unit tests', () => {
    let mockDb, mockModel, mockUtils, context;
    const fixedTimestamp = '2024-07-03T22:06:19.869Z';

    beforeEach(() => {
        mockDb = {};
        mockModel = {
            User: {
                validateUser: jest.fn()
            },
            Session: {
                createSession: jest.fn(),
                getSessionById: jest.fn()
            }
        };
        mockUtils = {
            hashPassword: jest.fn(),
            uuidv4: jest.fn(() => 'test-uuid'),
            getDates: jest.fn(() => ({
                sessionExpireDateTime: fixedTimestamp,
                sessionExpireDateTimeFormatted: fixedTimestamp
            }))
        };
        context = {
            db: mockDb,
            model: mockModel,
            utils: mockUtils,
            token: 'validtoken'
        };
    });

    it('should login user and create session', async () => {
        const username = 'testuser';
        const password = 'password123';
        const hashedPassword = 'hashedpassword123';

        const user = {
            id: 1,
            username,
            avatar: 'avatar-url',
            admin: true
        };

        const session = {
            id: 1,
            userId: user.id,
            sessionToken: 'test-uuid',
            sessionExpireDateTime: fixedTimestamp
        };

        mockUtils.hashPassword.mockReturnValue(hashedPassword);
        mockModel.User.validateUser.mockResolvedValue(user);
        mockModel.Session.createSession.mockResolvedValue(session.id);
        mockModel.Session.getSessionById.mockResolvedValue(session);

        const result = await loginUser(null, { username, password }, context);

        expect(mockUtils.hashPassword).toHaveBeenCalledWith(password);
        expect(mockModel.User.validateUser).toHaveBeenCalledWith(mockDb, username, hashedPassword);
        expect(mockModel.Session.createSession).toHaveBeenCalledWith(mockDb, mockUtils, user.id, 'test-uuid', fixedTimestamp);
        expect(mockModel.Session.getSessionById).toHaveBeenCalledWith(mockDb, session.id);
        expect(result).toEqual({
            userId: user.id,
            sessionId: session.id,
            username: user.username,
            avatarPicture: user.avatar,
            sessionToken: session.sessionToken,
            sessionExpireDateTime: fixedTimestamp,
            admin: user.admin
        });
    });

    it('should throw an error for invalid username or password', async () => {
        const username = 'testuser';
        const password = 'wrongpassword';
        const hashedPassword = 'hashedpassword';

        mockUtils.hashPassword.mockReturnValue(hashedPassword);
        mockModel.User.validateUser.mockResolvedValue(null);

        await expect(loginUser(null, { username, password }, context)).rejects.toThrow('Invalid username or password');

        expect(mockUtils.hashPassword).toHaveBeenCalledWith(password);
        expect(mockModel.User.validateUser).toHaveBeenCalledWith(mockDb, username, hashedPassword);
        expect(mockModel.Session.createSession).not.toHaveBeenCalled();
        expect(mockModel.Session.getSessionById).not.toHaveBeenCalled();
    });
});
