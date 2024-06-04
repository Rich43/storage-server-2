import {readFileSync} from 'fs';
import {gql} from 'graphql-tag';
import db from './db.mjs'; // Import the Knex instance

const typeDefs = gql(readFileSync('schema.graphql', 'utf8'));

const resolvers = {
    Query: {
        login: async (_, { username, password }, { token }) => {
            // Implement your login logic here
            console.log('Token:', token);
            // Use db to interact with the database
            const user = await db('User').where({ username, password }).first();
            if (!user) {
                throw new Error('Invalid username or password');
            }
            // Assuming session management logic here
            const session = await db('Session').insert({
                userId: user.id,
                sessionToken: 'token', // Generate token as needed
                sessionExpireDateTime: new Date(Date.now() + 3600000), // 1 hour expiration
                admin: user.admin,
            }).returning('*');

            return {
                userId: user.id,
                sessionId: session.id,
                username: user.username,
                avatarPicture: user.avatar,
                sessionToken: session.sessionToken,
                sessionExpireDateTime: session.sessionExpireDateTime,
                admin: user.admin,
            };
        },
        logout: async (_, __, { token }) => {
            // Implement your logout logic here
            console.log('Token:', token);
            await db('Session').where({ sessionToken: token }).del();
            return true;
        },
        refreshSession: async (_, __, { token }) => {
            // Implement your refreshSession logic here
            console.log('Token:', token);
            const session = await db('Session').where({ sessionToken: token }).first();
            if (!session) {
                throw new Error('Invalid session token');
            }
            const newToken = 'newToken'; // Generate new token as needed
            await db('Session').where({ sessionToken: token }).update({
                sessionToken: newToken,
                sessionExpireDateTime: new Date(Date.now() + 3600000),
            });
            const user = await db('User').where({ id: session.userId }).first();
            return {
                userId: user.id,
                sessionId: session.id,
                username: user.username,
                avatarPicture: user.avatar,
                sessionToken: newToken,
                sessionExpireDateTime: new Date(Date.now() + 3600000),
                admin: user.admin,
            };
        },
        listVideos: async () => {
            // Implement your listVideos logic here
            return db('Media').where({ mimetype: 'video' });
        },
        listMusic: async () => {
            // Implement your listMusic logic here
            return db('Media').where({ mimetype: 'audio' });
        },
        listAlbums: async () => {
            // Implement your listAlbums logic here
            return db('Album').select('*');
        },
        listPictures: async () => {
            // Implement your listPictures logic here
            return db('Media').where({ mimetype: 'image' });
        },
    },
};

export { typeDefs, resolvers };
