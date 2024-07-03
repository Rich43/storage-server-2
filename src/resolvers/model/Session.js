// noinspection UnnecessaryLocalVariableJS

import moment from "moment";

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

export const createSession = async (db, userId, sessionToken, sessionExpireDateTimeFormatted) => {
    const sessionData = {
        userId,
        sessionToken,
        sessionExpireDateTime: sessionExpireDateTimeFormatted,
        created: db.fn.now(),
        updated: db.fn.now()  // Assuming there's an updated field
    };

    await db('Session').insert(sessionData);

    const insertedSession = await db('Session')
        .where(sessionData)
        .first();

    return insertedSession.id;
};

export async function getSessionById(db, sessionId) {
    const session = await db('Session').where({id: sessionId}).first();
    return session;
}

export function deleteSession(db, token) {
    return db('Session').where({sessionToken: token}).del();
}

export async function updateSessionWithNewTokenAndExpiryDate(db, token, newSessionToken, sessionExpireDateTimeFormatted) {
    await db('Session')
        .where({sessionToken: token})
        .update({
            sessionToken: newSessionToken,
            sessionExpireDateTime: sessionExpireDateTimeFormatted,
            updated: db.fn.now(),
        });
}

export async function getAdminFlagFromSession(db, token) {
    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();
    return userSession;
}
