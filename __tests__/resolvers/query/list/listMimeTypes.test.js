import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import listMimeTypes from "../../../../src/resolvers/query/list/listMimeTypes";

describe("listMimeTypes Resolver", () => {
    let dbMock;
    let modelMock;
    let utilsMock;
    const tokenMock = "testToken";

    beforeEach(() => {
        dbMock = jest.fn();
        modelMock = {
            Session: {
                validateToken: jest.fn(),
            },
            User: {
                getUserFromToken: jest.fn().mockResolvedValue({ id: 1 }),
            },
        };
        utilsMock = {
            performFilter: jest.fn((filter, query) => query),
            performPagination: jest.fn((pagination, query) => query),
            performSorting: jest.fn((sorting, query) => query),
        };
    });

    it("fetches MIME types with filters, pagination, and sorting", async () => {
        const dbQueryMock = {
            where: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue([
                { id: 1, type: "image/jpeg", category: "IMAGE", preferred_extension: "jpg" },
                { id: 2, type: "video/mp4", category: "VIDEO", preferred_extension: "mp4" },
            ]),
        };

        dbMock.mockReturnValue(dbQueryMock);

        const filter = { category: "IMAGE" };
        const pagination = { page: 1, limit: 10 };
        const sorting = { field: "type", order: "asc" };

        const result = await listMimeTypes(
            null,
            { filter, pagination, sorting },
            { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock }
        );

        expect(modelMock.Session.validateToken).toHaveBeenCalledWith(dbMock, utilsMock, tokenMock);
        expect(modelMock.User.getUserFromToken).toHaveBeenCalledWith(dbMock, tokenMock);
        expect(utilsMock.performFilter).toHaveBeenCalledWith(filter, dbQueryMock);
        expect(utilsMock.performPagination).toHaveBeenCalledWith(pagination, dbQueryMock);
        expect(utilsMock.performSorting).toHaveBeenCalledWith(sorting, dbQueryMock);
        expect(result).toEqual([
            { id: 1, type: "image/jpeg", category: "IMAGE", preferred_extension: "jpg" },
            { id: 2, type: "video/mp4", category: "VIDEO", preferred_extension: "mp4" },
        ]);
    });

    it("handles database errors gracefully", async () => {
        dbMock.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            select: jest.fn().mockRejectedValue(new Error("Database error")),
        });

        await expect(
            listMimeTypes(null, {}, { db: dbMock, model: modelMock, utils: utilsMock, token: tokenMock })
        ).rejects.toThrow("Database error");
    });
});
