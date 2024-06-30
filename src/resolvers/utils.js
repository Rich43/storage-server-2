import moment from 'moment';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export function getDates() {
    const sessionExpireDateTime = moment().add(1, 'hour').utc().toISOString(); // 1 hour expiration in UTC
    const sessionExpireDateTimeFormatted = moment(sessionExpireDateTime).utc().format('YYYY-MM-DD HH:mm:ss');
    return { sessionExpireDateTime, sessionExpireDateTimeFormatted };
}

export function hashPassword(password) {
    return crypto.createHash('sha3-512').update(password).digest('hex');
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

export const __ALL__ = {getDates, hashPassword, performFilter, performPagination, performSorting, uuidv4};
