import moment from 'moment';

async function removeExpiredSessions(db) {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const futureLimit = moment().add(2, 'hours').utc().format('YYYY-MM-DD HH:mm:ss');

    // Remove expired sessions and sessions that are more than 2 hours into the future
    await db('Session')
        .where('sessionExpireDateTime', '<', now)
        .orWhere('sessionExpireDateTime', '>', futureLimit)
        .del();

    // Identify and remove old sessions for each user, keeping only the newest one
    const latestSessions = await db('Session')
        .select('userId')
        .max('sessionExpireDateTime as maxExpire')
        .groupBy('userId');

    for (const { userId, maxExpire } of latestSessions) {
        await db('Session')
            .where('userId', userId)
            .andWhere('sessionExpireDateTime', '<>', maxExpire)
            .del();
    }
}

export function sessionCleanupMiddleware(db) {
    return async (req, res, next) => {
        try {
            await removeExpiredSessions(db);
            next();
        } catch (err) {
            console.error('Failed to remove expired sessions:', err);
            next(err);
        }
    };
}
