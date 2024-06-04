import {v4 as uuidv4} from 'uuid';

const resolvers = {
    Query: {
        login: async (_, { username, password }, { db, token }) => {
            // Find user by username and password
            const user = await db('User').where({ username, password }).first();
            if (!user) {
                throw new Error('Invalid username or password');
            }
            // Generate session token and expiry date
            const sessionToken = uuidv4(); // Generate a unique session token
            const sessionExpireDateTime = new Date(Date.now() + 3600000); // 1 hour expiration

            // Create new session
            const [session] = await db('Session')
                .insert({
                    userId: user.id,
                    sessionToken,
                    sessionExpireDateTime,
                })
                .returning('*');

            return {
                userId: user.id,
                sessionId: session.id,
                username: user.username,
                avatarPicture: user.avatar,
                sessionToken: session.sessionToken,
                sessionExpireDateTime: session.sessionExpireDateTime,
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
            const newSessionExpireDateTime = new Date(Date.now() + 3600000); // 1 hour expiration

            // Update session with new token and expiry date
            await db('Session')
                .where({ sessionToken: token })
                .update({
                    sessionToken: newSessionToken,
                    sessionExpireDateTime: newSessionExpireDateTime,
                });

            // Retrieve user details
            const user = await db('User').where({ id: session.userId }).first();

            return {
                userId: user.id,
                sessionId: session.id,
                username: user.username,
                avatarPicture: user.avatar,
                sessionToken: newSessionToken,
                sessionExpireDateTime: newSessionExpireDateTime,
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
