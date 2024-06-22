import {
    getMediaQuery,
    getUserFromToken,
    performFilter,
    performPagination,
    performSorting,
    validateToken
} from '../../utils.js';

const listDocuments = async (_, { filter, pagination, sorting }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);
    let mediaQuery = getMediaQuery(db, user, 'DOCUMENT');
    mediaQuery = performFilter(filter, mediaQuery);
    mediaQuery = performPagination(pagination, mediaQuery);
    mediaQuery = performSorting(sorting, mediaQuery);
    return mediaQuery;
};

export default listDocuments;
