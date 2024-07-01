// noinspection JSCheckFunctionSignatures

import { jest } from "@jest/globals";

const mockValidateToken = jest.fn();
const mockGetUserFromToken = jest.fn();
const mockGetMediaQuery = jest.fn();
const mockPerformFilter = jest.fn();
const mockPerformPagination = jest.fn();
const mockPerformSorting = jest.fn();

const db = {}; // Mock database object
const model = {
    Session: {
        validateToken: mockValidateToken,
    },
    User: {
        getUserFromToken: mockGetUserFromToken,
    },
    Media: {
        getMediaQuery: mockGetMediaQuery,
    }
};
const utils = {
    performFilter: mockPerformFilter,
    performPagination: mockPerformPagination,
    performSorting: mockPerformSorting,
};
const token = 'mock-token'; // Mock token object

const setupMocks = (user, mediaQuery) => {
    mockValidateToken.mockResolvedValue(true);
    mockGetUserFromToken.mockResolvedValue(user);
    mockGetMediaQuery.mockReturnValue(mediaQuery);
    mockPerformFilter.mockImplementation((filter, query) => query);
    mockPerformPagination.mockImplementation((pagination, query) => query);
    mockPerformSorting.mockImplementation((sorting, query) => query);
};

export {
    db,
    model,
    utils,
    token,
    setupMocks,
    mockValidateToken,
    mockGetUserFromToken,
    mockGetMediaQuery,
    mockPerformFilter,
    mockPerformPagination,
    mockPerformSorting,
};
