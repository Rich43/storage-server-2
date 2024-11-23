import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './db.js';
import bodyParser from 'body-parser';
import { logger, requestLogger } from './logger.js';
import { sessionCleanupMiddleware } from './middleware.js';
import resolvers from './resolvers/index.js';
import model from './resolvers/model/index.js';
import { __ALL__ } from './resolvers/utils/utils.js';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load schema
const typesArray = loadFilesSync(`${__dirname}/**/*.graphql`);
const typeDefs = mergeTypeDefs(typesArray);

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
    const token = req.headers.authorization
        ? req.headers.authorization
              .trim()
              .toLowerCase()
              .replaceAll(' ', '')
              .replaceAll('bearer', '') || ''
        : undefined;
    return { db, model, __ALL__, token };
};

// Create the Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});

// Start the Apollo server
async function main() {
    await server.start();
}

main().then(() => {
    // Apply the Apollo GraphQL middleware and set the path to /graphql
    // noinspection JSCheckFunctionSignatures
    app.use('/graphql', expressMiddleware(server, { context }));

    app.get('/health', async (req, res) => {
        try {
            // Perform a lightweight query to ensure the database is reachable
            await db.raw('SELECT 1');
            res.status(200).json({
                status: 'ok',
                message: 'Server and database are healthy',
            });
        } catch (error) {
            logger.error('Database health check failed:', error);
            res.status(500).json({
                status: 'error',
                message: 'Database connection failed',
            });
        }
    });

    // Define a default route
    app.get('/', (req, res) => {
        res.send('Hello, this is the GraphQL API server.');
    });

    // Start the Express server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
});
