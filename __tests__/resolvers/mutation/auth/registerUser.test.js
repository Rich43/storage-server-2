import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import registerUser from '../../../../src/resolvers/mutation/auth/registerUser';

describe('registerUser', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            User: {
                getUserCount: jest.fn(),
                createNewUser: jest.fn(),
            },
        };
        mockUtils = {
            hashPassword: jest.fn(),
            moment: jest.fn().mockReturnValue({
                utc: jest.fn().mockReturnValue({
                    toISOString: jest.fn().mockReturnValue('2024-07-08T00:00:00.000Z'),
                }),
            }),
            uuidv4: jest.fn().mockReturnValue('unique-activation-key'),
        };
        mockToken = 'mockToken';
    });

    it('should register the first user as an admin and activated', async () => {
        const input = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Password1',
        };

        const hashedPassword = 'hashedPassword';
        const insertedUser = {
            id: 1,
            username: 'testuser',
            password: hashedPassword,
            admin: true,
            created: '2024-07-08T00:00:00.000Z',
            avatar: null,
            activated: true,
            activation_key: 'unique-activation-key',
            banned: false,
            updated: '2024-07-08T00:00:00.000Z',
        };

        mockUtils.hashPassword.mockReturnValue(hashedPassword);
        mockModel.User.getUserCount.mockResolvedValue([{ count: 0 }]);
        mockModel.User.createNewUser.mockResolvedValue([insertedUser]);

        const result = await registerUser(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockUtils.hashPassword).toHaveBeenCalledWith(input.password);
        expect(mockModel.User.getUserCount).toHaveBeenCalledWith(mockDb);
        expect(mockModel.User.createNewUser).toHaveBeenCalledWith(mockDb, mockUtils, expect.objectContaining({
            username: input.username,
            password: hashedPassword,
            admin: true,
            activated: true,
            activation_key: 'unique-activation-key',
        }));
        expect(result).toEqual(insertedUser);
    });

    it('should register a subsequent user as not admin and not activated', async () => {
        const input = {
            username: 'testuser2',
            email: 'testuser2@example.com',
            password: 'Password2',
        };

        const hashedPassword = 'hashedPassword2';
        const insertedUser = {
            id: 2,
            username: 'testuser2',
            password: hashedPassword,
            admin: false,
            created: '2024-07-08T00:00:00.000Z',
            avatar: null,
            activated: false,
            activation_key: 'unique-activation-key',
            banned: false,
            updated: '2024-07-08T00:00:00.000Z',
        };

        mockUtils.hashPassword.mockReturnValue(hashedPassword);
        mockModel.User.getUserCount.mockResolvedValue([{ count: 1 }]);
        mockModel.User.createNewUser.mockResolvedValue([insertedUser]);

        const result = await registerUser(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken });

        expect(mockUtils.hashPassword).toHaveBeenCalledWith(input.password);
        expect(mockModel.User.getUserCount).toHaveBeenCalledWith(mockDb);
        expect(mockModel.User.createNewUser).toHaveBeenCalledWith(mockDb, mockUtils, expect.objectContaining({
            username: input.username,
            password: hashedPassword,
            admin: false,
            activated: false,
            activation_key: 'unique-activation-key',
        }));
        expect(result).toEqual(insertedUser);
    });

    it('should throw an error if user creation fails', async () => {
        const input = {
            username: 'testuser3',
            email: 'testuser3@example.com',
            password: 'Password3',
        };

        mockUtils.hashPassword.mockReturnValue('hashedPassword3');
        mockModel.User.getUserCount.mockResolvedValue([{ count: 1 }]);
        mockModel.User.createNewUser.mockRejectedValue(new Error('User creation failed'));

        await expect(registerUser(null, { input }, { db: mockDb, model: mockModel, utils: mockUtils, token: mockToken }))
            .rejects
            .toThrow('User creation failed');
    });
});
