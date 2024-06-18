import {
    getMediaQuery,
    getUserFromToken,
    performFilter,
    performPagination,
    performSorting,
    validateToken
} from '../utils.js';

const listOtherFiles = async (_, { filter, pagination, sorting }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);
    let mediaQuery = getMediaQuery(db, user, 'OTHER');
    mediaQuery = performFilter(filter, mediaQuery);
    mediaQuery = performPagination(pagination, mediaQuery);
    mediaQuery = performSorting(sorting, mediaQuery);
    return mediaQuery;
};

export default listOtherFiles;
