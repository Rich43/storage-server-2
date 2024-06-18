import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import db from './db.js';
import bodyParser from 'body-parser';
import { logger, requestLogger } from './logger.js';
import { sessionCleanupMiddleware } from "./middleware.js";
import resolvers from "./resolvers/index.js";

// Load schema
const typeDefs = gql(readFileSync('schema.graphql', 'utf8'));

// Initialize the Express application
const app = express();

// Apply the session cleanup middleware
app.use(sessionCleanupMiddleware(db));

// Middleware to log requests
app.use(requestLogger);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define the context to include the database connection and other context-related information
const context = ({ req }) => {
    const token = req.headers.authorization || '';
    return { db, token };
};

// Create the Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start the Apollo server
await server.start();

// Apply the Apollo GraphQL middleware and set the path to /graphql
app.use('/graphql', expressMiddleware(server, { context }));

// Define a default route
app.get('/', (req, res) => {
    res.send('Hello, this is the GraphQL API server.');
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
