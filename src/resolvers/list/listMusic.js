import { validateToken } from "../utils.js";

const listMusic = async (_, { filter, pagination, sorting }, { db, token }) => {
    const session = await validateToken(db, token);

    // Join Session with User to get the admin flag
    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    let mediaQuery = db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', 'AUDIO')
        .select('Media.*', 'Mimetype.type as mimetype');

    if (!userSession.admin) {
        mediaQuery = mediaQuery.where('Media.adminOnly', false);
    }

    // Apply filters
    if (filter) {
        if (filter.title) {
            mediaQuery = mediaQuery.where('Media.title', 'like', `%${filter.title}%`);
        }
        if (filter.mimetype) {
            mediaQuery = mediaQuery.where('Mimetype.type', filter.mimetype);
        }
        if (filter.userId) {
            mediaQuery = mediaQuery.where('Media.userId', filter.userId);
        }
        if (filter.adminOnly !== undefined) {
            mediaQuery = mediaQuery.where('Media.adminOnly', filter.adminOnly);
        }
    }

    // Apply pagination
    if (pagination) {
        const { page, limit } = pagination;
        mediaQuery = mediaQuery.limit(limit).offset((page - 1) * limit);
    }

    // Apply sorting
    if (sorting) {
        const { field, order } = sorting;
        mediaQuery = mediaQuery.orderBy(field, order);
    }

    return mediaQuery;
};

export default listMusic;
