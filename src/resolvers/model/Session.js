export async function validateToken(db, utils, token) {
    const session = await db('Session').where({ sessionToken: token }).first();
    if (!session) {
        throw new Error('Invalid session token');
    }
    const now = utils.moment().utc();
    if (now.isAfter(utils.moment(session.sessionExpireDateTime).utc())) {
        throw new Error('Session token has expired');
    }
    return session;
}

export async function createSession(db, utils, userId, sessionToken, sessionExpireDateTimeFormatted) {
    const currentTime = utils.moment().utc().toISOString();
    const sessionData = {
        userId,
        sessionToken,
        sessionExpireDateTime: sessionExpireDateTimeFormatted,
        created: currentTime,
        updated: currentTime, // Assuming there's an updated field
    };

    await db('Session').insert(sessionData);

    const insertedSession = await db('Session')
        .where(sessionData)
        .first();

    return insertedSession.id;
}

export async function getSessionById(db, sessionId) {
    const session = await db('Session').where({ id: sessionId }).first();
    if (!session) {
        throw new Error('Session not found');
    }
    return session;
}

export async function deleteSession(db, token) {
    const deletedCount = await db('Session').where({ sessionToken: token }).del();
    if (deletedCount === 0) {
        throw new Error('Session token not found for deletion');
    }
    return deletedCount;
}

export async function updateSessionWithNewTokenAndExpiryDate(db, utils, token, newSessionToken, sessionExpireDateTimeFormatted) {
    const currentTime = utils.moment().utc().toISOString();
    const updateCount = await db('Session')
        .where({ sessionToken: token })
        .update({
            sessionToken: newSessionToken,
            sessionExpireDateTime: sessionExpireDateTimeFormatted,
            updated: currentTime,
        });

    if (updateCount === 0) {
        throw new Error('Failed to update session token, original token not found');
    }
    return updateCount;
}

export async function getAdminFlagFromSession(db, token) {
    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    if (!userSession) {
        throw new Error('Session or user not found');
    }
    return userSession.admin;
}
