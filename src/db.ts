import { ConnectionOptions } from 'mysql2';

export const config: ConnectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_username',
    database: process.env.DB_NAME || 'your_database',
    password: process.env.DB_PASSWORD || 'your_password',
    port: Number(process.env.DB_PORT) || 3306,
};
