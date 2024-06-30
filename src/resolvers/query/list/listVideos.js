import {
    getMediaQuery,
    getUserFromToken,
    performFilter,
    performPagination,
    performSorting,
    validateToken
} from '../../utils/utils.js';

const listVideos = async (_, { filter, pagination, sorting }, { db, token }) => {
    const session = await validateToken(db, token);
    const user = await getUserFromToken(db, token);
    let mediaQuery = getMediaQuery(db, user, 'VIDEO');
    mediaQuery = performFilter(filter, mediaQuery);
    mediaQuery = performPagination(pagination, mediaQuery);
    mediaQuery = performSorting(sorting, mediaQuery);

    return mediaQuery;
};

export default listVideos;
