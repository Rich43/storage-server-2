import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import crypto from 'crypto';

function getDates() {
    const sessionExpireDateTime = moment().add(1, 'hour').utc().toISOString(); // 1 hour expiration in UTC
    const sessionExpireDateTimeFormatted = moment(sessionExpireDateTime).utc().format('YYYY-MM-DD HH:mm:ss');
    return { sessionExpireDateTime, sessionExpireDateTimeFormatted };
}

function hashPassword(password) {
    return crypto.createHash('sha3-512').update(password).digest('hex');
}

const resolvers = {
    Query: {
        login: async (_, { username, password }, { db, token }) => {
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
        },
        logout: async (_, __, { db, token }) => {
            // Delete the session by token
            await db('Session').where({ sessionToken: token }).del();
            return true;
        },
        refreshSession: async (_, __, { db, token }) => {
            // Find session by token
            const session = await db('Session').where({ sessionToken: token }).first();
            if (!session) {
                throw new Error('Invalid session token');
            }

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
        },
        listVideos: async (_, __, { db }) => {
            return db('Media').where({ mimetype: 'video' });
        },
        listMusic: async (_, __, { db }) => {
            return db('Media').where({ mimetype: 'audio' });
        },
        listAlbums: async (_, __, { db }) => {
            return db('Album').select('*');
        },
        listPictures: async (_, __, { db }) => {
            return db('Media').where({ mimetype: 'image' });
        },
    },
};

export { resolvers };
