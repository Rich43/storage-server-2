import moment from 'moment';
import crypto from 'crypto';

export function getDates() {
    const sessionExpireDateTime = moment().add(1, 'hour').utc().toISOString(); // 1 hour expiration in UTC
    const sessionExpireDateTimeFormatted = moment(sessionExpireDateTime).utc().format('YYYY-MM-DD HH:mm:ss');
    return { sessionExpireDateTime, sessionExpireDateTimeFormatted };
}

export function hashPassword(password) {
    return crypto.createHash('sha3-512').update(password).digest('hex');
}

export async function validateToken(db, token) {
    const session = await db('Session').where({ sessionToken: token }).first();
    if (!session) {
        throw new Error('Invalid session token');
    }
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    if (session.sessionExpireDateTime < now) {
        throw new Error('Session token has expired');
    }
    return session;
}

export async function getUserFromToken(db, token) {
    const user = await db('User')
        .join('Session', 'User.id', 'Session.userId')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export function getMediaQuery(db, user, category) {
    let mediaQuery = db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', category)
        .select('Media.*', 'Mimetype.type as mimetype');

    if (!user.admin) {
        mediaQuery = mediaQuery.where('Media.adminOnly', false);
    }
    return mediaQuery;
}

export function performFilter(filter, mediaQuery) {
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
    return mediaQuery;
}

export function performPagination(pagination, mediaQuery) {
    if (pagination) {
        const {page, limit} = pagination;
        mediaQuery = mediaQuery.limit(limit).offset((page - 1) * limit);
    }
    return mediaQuery;
}

export function performSorting(sorting, mediaQuery) {
    if (sorting) {
        const {field, order} = sorting;
        mediaQuery = mediaQuery.orderBy(field, order);
    }
    return mediaQuery;
}