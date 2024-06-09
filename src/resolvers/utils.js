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
