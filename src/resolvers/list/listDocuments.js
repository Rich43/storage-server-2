import { validateToken } from './utils.js';

const listDocuments = async (_, { filter, pagination, sorting }, { db, token }) => {
    const session = await validateToken(db, token);

    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    let mediaQuery = db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', 'DOCUMENT')
        .select('Media.*', 'Mimetype.type as mimetype');

    if (!userSession.admin) {
        mediaQuery = mediaQuery.where('Media.adminOnly', false);
    }

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
    }

    if (pagination) {
        const { page, limit } = pagination;
        mediaQuery = mediaQuery.limit(limit).offset((page - 1) * limit);
    }

    if (sorting) {
        const { field, order } = sorting;
        mediaQuery = mediaQuery.orderBy(field, order);
    }

    return mediaQuery;
};

export default listDocuments;
