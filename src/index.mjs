import 'dotenv/config';
import express from 'express';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {resolvers, typeDefs} from './schema.mjs';
import {logger, requestLogger} from './logger.mjs';

const app = express();
const port = process.env.PORT || 4000;

(async () => {
    try {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        });

        await server.start();

        app.use(requestLogger);
        app.use('/graphql', express.json(), expressMiddleware(server, {
            context: async ({ req }) => {
                // Extract token from the headers
                const token = req.headers.authorization || '';
                return { pool, token };
            },
        }));

        app.listen(port, () => {
            logger.info(`🚀 Server ready at http://localhost:${port}/graphql`);
        });

        // Gracefully close database connections on termination signal
        process.on('SIGTERM', () => {
            pool.end().then(() => {
                logger.info('Database connection pool closed');
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
})();
