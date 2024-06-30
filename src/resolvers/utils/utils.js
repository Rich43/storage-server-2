import moment from 'moment';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getMediaKeywords, performFilter, performPagination, performSorting } from "./mediaUtils.js";

export function getDates() {
    const sessionExpireDateTime = moment().add(1, 'hour').utc().toISOString(); // 1 hour expiration in UTC
    const sessionExpireDateTimeFormatted = moment(sessionExpireDateTime).utc().format('YYYY-MM-DD HH:mm:ss');
    return { sessionExpireDateTime, sessionExpireDateTimeFormatted };
}

export function hashPassword(password) {
    return crypto.createHash('sha3-512').update(password).digest('hex');
}

export const __ALL__ = {
    getDates, hashPassword, performFilter, performPagination,
    performSorting, getMediaKeywords, uuidv4
};
