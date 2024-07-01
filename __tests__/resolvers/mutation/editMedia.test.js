// noinspection JSUnusedLocalSymbols,JSCheckFunctionSignatures

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import editMedia from '../../../src/resolvers/mutation/editMedia';

// Mock dependencies
const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaById = jest.fn();
const mockGetMimetypeIdByType = jest.fn();
const mockUpdateMediaById = jest.fn();
const mockNow = jest.fn();

const db = {
    fn: {
        now: mockNow
    }
}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Media: {
        getMediaById: mockGetMediaById,
        updateMediaById: mockUpdateMediaById,
    },
    Mimetype: {
        getMimetypeIdByType: mockGetMimetypeIdByType,
    }
};
const utils = {}; // Mock utilities object if needed
const token = 'mock-token'; // Mock token object

const commonMocks = (user, media, mimetypeFunc) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaById.mockResolvedValue(media);
    mockGetMimetypeIdByType.mockResolvedValue(mimetypeFunc);
    mockNow.mockReturnValue(new Date());
};

describe('editMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should edit media successfully', async () => {
        const input = { id: 1, title: 'New Title', description: 'New Description', url: 'new-url', mimetype: 'image/png', thumbnail: 'new-thumbnail' };
        const user = { id: 1, admin: true };
        const media = { id: 1, title: 'Old Title', description: 'Old Description', url: 'old-url', mimetype_id: 1, thumbnail: 'old-thumbnail', adminOnly: false };
        const mimetypeFunc = { id: 2 };

        commonMocks(user, media, mimetypeFunc);
        mockUpdateMediaById.mockResolvedValue(true);

        const result = await editMedia(null, { input }, { db, model, utils, token });

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, input.id);
        expect(mockGetMimetypeIdByType).toHaveBeenCalledWith(db, input.mimetype);
        expect(mockUpdateMediaById).toHaveBeenCalledWith(db, input.id, {
            title: input.title,
            description: input.description,
            url: input.url,
            mimetype_id: mimetypeFunc.id,
            thumbnail: input.thumbnail,
            updated: expect.any(Date)
        });
        expect(mockGetMediaById).toHaveBeenCalledWith(db, input.id);
    });

    it('should throw an error if media not found', async () => {
        const input = { id: 1 };
        const user = { id: 1, admin: true };

        mockValidateToken.mockResolvedValue(true);
        mockGetUserFromToken.mockResolvedValue(user);
        mockGetMediaById.mockResolvedValue(null);

        await expect(editMedia(null, { input }, { db, model, utils, token })).rejects.toThrow('Media not found');

        expect(mockValidateToken).toHaveBeenCalledWith(db, token);
        expect(mockGetUserFromToken).toHaveBeenCalledWith(db, token);
        expect(mockGetMediaById).toHaveBeenCalledWith(db, input.id);
        expect(mockUpdateMediaById).not.toHaveBeenCalled();
    });

    it('should update adminOnly field for admin users', async () => {
        const input = { id: 1, adminOnly: true };
        const user = { id: 1, admin: true };
        const media = { id: 1, adminOnly: false };
        const mimetypeFunc = { id: 2 };

        commonMocks(user, media, mimetypeFunc);
        mockUpdateMediaById.mockResolvedValue(true);

        const result = await editMedia(null, { input }, { db, model, utils, token });

        expect(mockUpdateMediaById).toHaveBeenCalledWith(db, input.id, {
            adminOnly: input.adminOnly,
            updated: expect.any(Date)
        });
        expect(result).toEqual(media);
    });

    it('should not update adminOnly field for non-admin users', async () => {
        const input = { id: 1, adminOnly: true };
        const user = { id: 1, admin: false };
        const media = { id: 1, adminOnly: false };
        const mimetypeFunc = { id: 2 };

        commonMocks(user, media, mimetypeFunc);
        mockUpdateMediaById.mockResolvedValue(true);

        const result = await editMedia(null, { input }, { db, model, utils, token });

        expect(mockUpdateMediaById).toHaveBeenCalledWith(db, input.id, {
            updated: expect.any(Date)
        });
        expect(result).toEqual(media);
    });
});
