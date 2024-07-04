// noinspection UnnecessaryLocalVariableJS

export async function validateToken(db, utils, token) {
    const session = await db('Session').where({ sessionToken: token }).first();
    if (!session) {
        throw new Error('Invalid session token');
    }
    const now = utils.moment().utc();
    if (utils.moment(now).utc().isBefore(session.sessionExpireDateTime)) {
        throw new Error('Session token has expired');
    }
    return session;
}

export async function createSession(db, utils, userId, sessionToken, sessionExpireDateTimeFormatted)  {
    const sessionData = {
        userId,
        sessionToken,
        sessionExpireDateTime: sessionExpireDateTimeFormatted,
        created: utils.moment().utc().toISOString(),
        updated: utils.moment().utc().toISOString()  // Assuming there's an updated field
    };

    await db('Session').insert(sessionData);

    const insertedSession = await db('Session')
        .where(sessionData)
        .first();

    return insertedSession.id;
}

export async function getSessionById(db, sessionId) {
    const session = await db('Session').where({id: sessionId}).first();
    return session;
}

export function deleteSession(db, token) {
    return db('Session').where({sessionToken: token}).del();
}

export async function updateSessionWithNewTokenAndExpiryDate(db, utils, token, newSessionToken, sessionExpireDateTimeFormatted) {
    await db('Session')
        .where({sessionToken: token})
        .update({
            sessionToken: newSessionToken,
            sessionExpireDateTime: sessionExpireDateTimeFormatted,
            updated: utils.moment().utc().toISOString(),
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
