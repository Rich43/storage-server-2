import { v4 as uuidv4 } from 'uuid';
import { getDates, validateToken } from '../utils.js';

const refreshSession = async (_, __, { db, token }) => {
    const session = await validateToken(db, token);

    // Generate new session token and expiry date
    const newSessionToken = uuidv4(); // Generate a new unique token
    const { sessionExpireDateTime, sessionExpireDateTimeFormatted } = getDates();
    // Update session with new token and expiry date
    await db('Session')
        .where({ sessionToken: token })
        .update({
            sessionToken: newSessionToken,
            sessionExpireDateTime: sessionExpireDateTimeFormatted,
        });

    // Retrieve user details
    const user = await db('User').where({ id: session.userId }).first();

    return {
        userId: user.id,
        sessionId: session.id,
        username: user.username,
        avatarPicture: user.avatar,
        sessionToken: newSessionToken,
        sessionExpireDateTime: sessionExpireDateTime, // Return as ISO string in UTC
        admin: user.admin, // Use the admin field from the User table
    };
};

export default refreshSession;
