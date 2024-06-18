import { validateToken } from './utils.js';
import { getMediaQuery, getUserFromToken, performFilter, performPagination, performSorting } from "../utils.js";

const listMusic = async (_, { filter, pagination, sorting }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);
    let mediaQuery = getMediaQuery(db, user, 'AUDIO');
    mediaQuery = performFilter(filter, mediaQuery);
    mediaQuery = performPagination(pagination, mediaQuery);
    mediaQuery = performSorting(sorting, mediaQuery);

    return mediaQuery;
};

export default listMusic;
