import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schema';
import { createConnection } from 'mysql2/promise';
import { config } from './db';
import { logger, requestLogger } from './logger';

const app = express();
const port = process.env.PORT || 4000;

const connection = await createConnection(config);

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

await server.start();

app.use(requestLogger);
app.use('/graphql', express.json(), expressMiddleware(server, {
    context: async () => ({ connection }),
}));

app.listen(port, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}/graphql`);
});

process.on('SIGTERM', () => {
    connection.end().then(() => {
        logger.info('Database connection closed');
        process.exit(0);
    });
});
