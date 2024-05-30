import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { Resolvers } from './generated/graphql';

const typeDefs = gql(readFileSync('src/schema.graphql', 'utf8'));

const resolvers: Resolvers = {
    Query: {
        login: async (_, { username, password }, { pool, token }) => {
            // Implement your login logic here
            console.log('Token:', token);
            // Use pool to interact with the database
            return {
                userId: 1,
                sessionId: 1,
                username: username,
                avatarPicture: null,
                sessionToken: 'token',
                sessionExpireDateTime: new Date().toISOString(),
                admin: false,
            };
        },
        logout: async (_, __, { token }) => {
            // Implement your logout logic here
            console.log('Token:', token);
            return true;
        },
        refreshSession: async (_, __, { token }) => {
            // Implement your refreshSession logic here
            console.log('Token:', token);
            return {
                userId: 1,
                sessionId: 1,
                username: 'username',
                avatarPicture: null,
                sessionToken: 'newToken',
                sessionExpireDateTime: new Date().toISOString(),
                admin: false,
            };
        },
        listVideos: async () => {
            // Implement your listVideos logic here
            return [];
        },
        listMusic: async () => {
            // Implement your listMusic logic here
            return [];
        },
        listAlbums: async () => {
            // Implement your listAlbums logic here
            return [];
        },
        listPictures: async () => {
            // Implement your listPictures logic here
            return [];
        },
    },
};

export { typeDefs, resolvers };
