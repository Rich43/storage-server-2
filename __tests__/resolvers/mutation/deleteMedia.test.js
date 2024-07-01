import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import deleteMedia from '../../../src/resolvers/mutation/deleteMedia';
import { CustomError } from '../../../src/resolvers/utils/CustomError';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaById = jest.fn();
const mockDeleteMediaById = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Media: {
        getMediaById: mockGetMediaById,
        deleteMediaById: mockDeleteMediaById,
    },
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

describe('deleteMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete media successfully for the owner', async () => {
        const id = 1;
        const session = { userId: 1 };
        const user = { id: 1, admin: false };
        const media = { id, userId: 1, adminOnly: false };

        mockValidateToken.mockResolvedValue(session);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaById.mockResolvedValue(media);
        mockDeleteMediaById.mockResolvedValue(true);

        const result = await deleteMedia(null, { id }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaById).toHaveBeenCalledWith(db, id);
        expect(result).toBe(true);
    });

    it('should throw an error if media not found', async () => {
        const id = 1;
        const session = { userId: 1 };

        mockValidateToken.mockResolvedValue(session);
        mockGetUserFromToken.mockResolvedValue({ id: 1, admin: false });
        mockGetMediaById.mockResolvedValue(null);

        try {
            await deleteMedia(null, { id }, { db, model, utils, token });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Failed to delete media');
            expect(error.originalError.message).toBe('Media not found');
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaById).not.toHaveBeenCalled();
    });

    it('should throw an error if trying to delete someone else\'s media', async () => {
        const id = 1;
        const session = { userId: 1 };
        const media = { id, userId: 2, adminOnly: false };

        mockValidateToken.mockResolvedValue(session);
        mockGetUserFromToken.mockResolvedValue({ id: 1, admin: false });
        mockGetMediaById.mockResolvedValue(media);

        try {
            await deleteMedia(null, { id }, { db, model, utils, token });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Failed to delete media');
            expect(error.originalError.message).toBe('You can only delete your own media');
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaById).not.toHaveBeenCalled();
    });

    it('should throw an error if non-admin tries to delete adminOnly media', async () => {
        const id = 1;
        const session = { userId: 1 };
        const user = { id: 1, admin: false };
        const media = { id, userId: 1, adminOnly: true };

        mockValidateToken.mockResolvedValue(session);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaById.mockResolvedValue(media);

        try {
            await deleteMedia(null, { id }, { db, model, utils, token });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Failed to delete media');
            expect(error.originalError.message).toBe('Only admins can delete adminOnly media');
        }

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, id);
        expect(mockDeleteMediaById).not.toHaveBeenCalled();
    });
});
