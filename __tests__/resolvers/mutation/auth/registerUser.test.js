import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import registerUser from '../../../../src/resolvers/mutation/auth/registerUser';

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid')
}));

describe('registerUser unit tests', () => {
    let mockDb, mockModel, mockUtils, context;
    const fixedTimestamp = '2024-07-03T22:06:19.869Z';

    beforeEach(() => {
        mockDb = {};
        mockModel = {
            User: {
                getUserCount: jest.fn(),
                createNewUser: jest.fn()
            }
        };
        mockUtils = {
            hashPassword: jest.fn(),
            moment: jest.fn(() => ({ utc: () => ({ toISOString: () => fixedTimestamp }) })),
            uuidv4: jest.fn(() => 'test-uuid')
        };
        context = {
            db: mockDb,
            model: mockModel,
            utils: mockUtils,
            token: 'validtoken'
        };
    });

    it('should register the first user as an admin and activated', async () => {
        const input = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        const hashedPassword = 'hashedpassword123';
        const newUser = {
            username: input.username,
            password: hashedPassword,
            admin: true,  // first user is admin
            created: fixedTimestamp,
            avatar: null,
            activated: true,  // first user is activated
            activation_key: 'test-uuid',
            banned: false,
            updated: fixedTimestamp
        };
        const insertedUser = { id: 1, ...newUser };

        mockUtils.hashPassword.mockReturnValue(hashedPassword);
        mockModel.User.getUserCount.mockResolvedValue([{ count: 0 }]);
        mockModel.User.createNewUser.mockResolvedValue([insertedUser]);

        const result = await registerUser(null, { input }, context);

        expect(mockUtils.hashPassword).toHaveBeenCalledWith(input.password);
        expect(mockModel.User.getUserCount).toHaveBeenCalledWith(mockDb);
        expect(mockModel.User.createNewUser).toHaveBeenCalledWith(mockDb, newUser);
        expect(result).toEqual(insertedUser);
    });

    it('should register a non-first user as not admin and not activated', async () => {
        const input = {
            username: 'testuser2',
            email: 'test2@example.com',
            password: 'password456'
        };

        const hashedPassword = 'hashedpassword456';
        const newUser = {
            username: input.username,
            password: hashedPassword,
            admin: false,  // not first user is not admin
            created: fixedTimestamp,
            avatar: null,
            activated: false,  // not first user is not activated
            activation_key: 'test-uuid',
            banned: false,
            updated: fixedTimestamp
        };
        const insertedUser = { id: 2, ...newUser };

        mockUtils.hashPassword.mockReturnValue(hashedPassword);
        mockModel.User.getUserCount.mockResolvedValue([{ count: 1 }]);
        mockModel.User.createNewUser.mockResolvedValue([insertedUser]);

        const result = await registerUser(null, { input }, context);

        expect(mockUtils.hashPassword).toHaveBeenCalledWith(input.password);
        expect(mockModel.User.getUserCount).toHaveBeenCalledWith(mockDb);
        expect(mockModel.User.createNewUser).toHaveBeenCalledWith(mockDb, newUser);
        expect(result).toEqual(insertedUser);
    });
});
