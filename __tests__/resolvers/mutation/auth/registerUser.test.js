import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import registerUser from '../../../../src/resolvers/mutation/auth/registerUser';

// Mock dependencies
const mockHashPassword = jest.fn();
const mockGetUserCount = jest.fn();
const mockCreateNewUser = jest.fn();
const mockUuidv4 = jest.fn();
const mockNow = jest.fn();

const db = {
    fn: {
        now: mockNow
    }
}; // Mock database object
const model = {
    User: {
        getUserCount: mockGetUserCount,
        createNewUser: mockCreateNewUser,
    },
};
const utils = {
    hashPassword: mockHashPassword,
    uuidv4: mockUuidv4,
};
const token = {}; // Mock token object if needed

const commonMocks = (hashedPassword, userCount, now, activationKey, insertedUser) => {
    mockHashPassword.mockReturnValue(hashedPassword);
    mockGetUserCount.mockResolvedValue(userCount);
    mockNow.mockReturnValue(now);
    mockUuidv4.mockReturnValue(activationKey);
    mockCreateNewUser.mockResolvedValue([insertedUser]);
};

const commonAssertions = (input, hashedPassword, userCount, now, activationKey, insertedUser, admin, activated) => {
    expect(mockHashPassword).toHaveBeenCalledWith(input.password);
    expect(mockGetUserCount).toHaveBeenCalledWith(db);
    expect(mockNow).toHaveBeenCalledTimes(2);
    expect(mockUuidv4).toHaveBeenCalled();
    expect(mockCreateNewUser).toHaveBeenCalledWith(db, {
        username: input.username,
        password: hashedPassword,
        admin,
        created: now,
        avatar: null,
        activated,
        activation_key: activationKey,
        banned: false,
        updated: now
    });
    expect(insertedUser).toEqual({
        id: insertedUser.id,
        username: input.username,
        email: input.email,
        password: hashedPassword,
        admin,
        created: now,
        avatar: null,
        activated,
        activation_key: activationKey,
        banned: false,
        updated: now
    });
};

describe('registerUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register the first user as admin and activated', async () => {
        const input = {
            username: 'firstUser',
            email: 'firstUser@example.com',
            password: 'password123'
        };
        const hashedPassword = 'hashedPassword';
        const userCount = [{ count: 0 }];
        const now = new Date();
        const activationKey = 'unique-activation-key';
        const insertedUser = {
            id: 1,
            username: 'firstUser',
            email: 'firstUser@example.com',
            password: hashedPassword,
            admin: true,
            created: now,
            avatar: null,
            activated: true,
            activation_key: activationKey,
            banned: false,
            updated: now
        };

        commonMocks(hashedPassword, userCount, now, activationKey, insertedUser);

        const result = await registerUser(null, { input }, { db, model, utils, token });

        commonAssertions(input, hashedPassword, userCount, now, activationKey, insertedUser, true, true);
        expect(result).toEqual(insertedUser);
    });

    it('should register a subsequent user as non-admin and not activated', async () => {
        const input = {
            username: 'secondUser',
            email: 'secondUser@example.com',
            password: 'password123'
        };
        const hashedPassword = 'hashedPassword';
        const userCount = [{ count: 1 }];
        const now = new Date();
        const activationKey = 'unique-activation-key';
        const insertedUser = {
            id: 2,
            username: 'secondUser',
            email: 'secondUser@example.com',
            password: hashedPassword,
            admin: false,
            created: now,
            avatar: null,
            activated: false,
            activation_key: activationKey,
            banned: false,
            updated: now
        };

        commonMocks(hashedPassword, userCount, now, activationKey, insertedUser);

        const result = await registerUser(null, { input }, { db, model, utils, token });

        commonAssertions(input, hashedPassword, userCount, now, activationKey, insertedUser, false, false);
        expect(result).toEqual(insertedUser);
    });

    it('should handle errors during user registration', async () => {
        const input = {
            username: 'errorUser',
            email: 'errorUser@example.com',
            password: 'password123'
        };
        const hashedPassword = 'hashedPassword';
        const userCount = [{ count: 1 }];
        const now = new Date();
        const activationKey = 'unique-activation-key';

        mockHashPassword.mockReturnValue(hashedPassword);
        mockGetUserCount.mockResolvedValue(userCount);
        mockNow.mockReturnValue(now);
        mockUuidv4.mockReturnValue(activationKey);
        mockCreateNewUser.mockRejectedValue(new Error('Database error'));

        await expect(registerUser(null, { input }, { db, model, utils, token })).rejects.toThrow('Database error');

        expect(mockHashPassword).toHaveBeenCalledWith(input.password);
        expect(mockGetUserCount).toHaveBeenCalledWith(db);
        expect(mockNow).toHaveBeenCalledTimes(2);
        expect(mockUuidv4).toHaveBeenCalled();
        expect(mockCreateNewUser).toHaveBeenCalledWith(db, {
            username: input.username,
            password: hashedPassword,
            admin: false,
            created: now,
            avatar: null,
            activated: false,
            activation_key: activationKey,
            banned: false,
            updated: now
        });
    });
});
