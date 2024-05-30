import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schema';
import { pool } from './db';
import { logger, requestLogger } from './logger';

// Define the context type
interface MyContext {
    pool: typeof pool;
    token?: string;
}

const app = express();
const port = process.env.PORT || 4000;

(async () => {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();

        const server = new ApolloServer<MyContext>({
            typeDefs,
            resolvers,
        });

        await server.start();

        app.use(requestLogger);
        app.use('/graphql', express.json(), expressMiddleware(server, {
            context: async ({ req }): Promise<MyContext> => {
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
