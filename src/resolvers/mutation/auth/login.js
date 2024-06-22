import { v4 as uuidv4 } from 'uuid';
import { getDates, hashPassword } from '../../utils.js';

const login = async (_, { username, password }, { db }) => {
    // Hash the password before querying
    const hashedPassword = hashPassword(password);
    // Find user by username and hashed password
    const user = await db('User').where({ username, password: hashedPassword }).first();
    if (!user) {
        throw new Error('Invalid username or password');
    }

    // Generate session token and expiry date
    const sessionToken = uuidv4(); // Generate a unique session token
    const { sessionExpireDateTime, sessionExpireDateTimeFormatted } = getDates();
    // Create new session
    const [sessionId] = await db('Session')
        .insert({
            userId: user.id,
            sessionToken,
            sessionExpireDateTime: sessionExpireDateTimeFormatted,
        })
        .returning('id');

    // Retrieve the full session object
    const session = await db('Session').where({ id: sessionId }).first();

    return {
        userId: user.id,
        sessionId: session.id,
        username: user.username,
        avatarPicture: user.avatar,
        sessionToken: session.sessionToken,
        sessionExpireDateTime: sessionExpireDateTime, // Return as ISO string in UTC
        admin: user.admin, // Use the admin field from the User table
    };
};

export default login;
