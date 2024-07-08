import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
    buildUpdatedMedia,
    getMimetypeId,
    validateSessionAndUser
} from "../../../src/resolvers/utils/editMediaUtils.js";

describe('editMediaUtils', () => {
    let mockDb, mockModel, mockUtils, mockToken;

    beforeEach(() => {
        mockDb = {}; // Mock database object
        mockModel = {
            Session: {
                validateToken: jest.fn(),
            },
            User: {
                getUserFromToken: jest.fn(),
            },
            Mimetype: {
                getMimetypeIdByType: jest.fn(),
            },
        };
        mockUtils = {}; // Mock utils object if necessary
        mockToken = 'mockToken';
    });

    describe('validateSessionAndUser', () => {
        it('should validate token and return user', async () => {
            const user = { id: 1, name: 'Test User' };

            mockModel.Session.validateToken.mockResolvedValue();
            mockModel.User.getUserFromToken.mockResolvedValue(user);

            const result = await validateSessionAndUser(mockDb, mockModel, mockUtils, mockToken);

            expect(mockModel.Session.validateToken).toHaveBeenCalledWith(mockDb, mockUtils, mockToken);
            expect(mockModel.User.getUserFromToken).toHaveBeenCalledWith(mockDb, mockToken);
            expect(result).toEqual(user);
        });

        it('should throw an error if token validation fails', async () => {
            mockModel.Session.validateToken.mockRejectedValue(new Error('Invalid token'));

            await expect(validateSessionAndUser(mockDb, mockModel, mockUtils, mockToken))
                .rejects
                .toThrow('Invalid token');
        });

        it('should throw an error if user retrieval fails', async () => {
            mockModel.Session.validateToken.mockResolvedValue();
            mockModel.User.getUserFromToken.mockRejectedValue(new Error('User not found'));

            await expect(validateSessionAndUser(mockDb, mockModel, mockUtils, mockToken))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('getMimetypeId', () => {
        it('should return mimetype ID', async () => {
            const mimetype = 'image/png';
            const mimetypeId = { id: 123 };

            mockModel.Mimetype.getMimetypeIdByType.mockResolvedValue(mimetypeId);

            const result = await getMimetypeId(mockDb, mockModel, mimetype);

            expect(mockModel.Mimetype.getMimetypeIdByType).toHaveBeenCalledWith(mockDb, mimetype);
            expect(result).toEqual(mimetypeId.id);
        });

        it('should throw an error if mimetype retrieval fails', async () => {
            const mimetype = 'image/png';

            mockModel.Mimetype.getMimetypeIdByType.mockRejectedValue(new Error('Mimetype not found'));

            await expect(getMimetypeId(mockDb, mockModel, mimetype))
                .rejects
                .toThrow('Mimetype not found');
        });
    });

    describe('buildUpdatedMedia', () => {
        it('should build updated media object correctly', () => {
            const input = {
                title: 'New Title',
                description: 'New Description',
                url: 'http://new-url.com',
                thumbnail: 'http://new-thumbnail.com',
                adminOnly: true,
            };
            const mimetypeId = 123;
            const updated = '2024-07-08T00:00:00.000Z';
            const user = { id: 1, admin: true };

            const result = buildUpdatedMedia(input, mimetypeId, updated, user);

            expect(result).toEqual({
                title: 'New Title',
                description: 'New Description',
                url: 'http://new-url.com',
                thumbnail: 'http://new-thumbnail.com',
                mimetype_id: mimetypeId,
                updated: '2024-07-08T00:00:00.000Z',
                adminOnly: true,
            });
        });

        it('should exclude adminOnly if user is not admin', () => {
            const input = {
                title: 'New Title',
                description: 'New Description',
                url: 'http://new-url.com',
                thumbnail: 'http://new-thumbnail.com',
                adminOnly: true,
            };
            const mimetypeId = 123;
            const updated = '2024-07-08T00:00:00.000Z';
            const user = { id: 1, admin: false };

            const result = buildUpdatedMedia(input, mimetypeId, updated, user);

            expect(result).toEqual({
                title: 'New Title',
                description: 'New Description',
                url: 'http://new-url.com',
                thumbnail: 'http://new-thumbnail.com',
                mimetype_id: mimetypeId,
                updated: '2024-07-08T00:00:00.000Z',
            });
        });

        it('should build updated media object with partial input', () => {
            const input = {
                title: 'New Title',
            };
            const mimetypeId = null;
            const updated = '2024-07-08T00:00:00.000Z';
            const user = { id: 1, admin: false };

            const result = buildUpdatedMedia(input, mimetypeId, updated, user);

            expect(result).toEqual({
                title: 'New Title',
                updated: '2024-07-08T00:00:00.000Z',
            });
        });
    });
});
