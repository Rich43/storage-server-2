import { createPool } from 'mysql2/promise';

export const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'storage',
    password: process.env.DB_PASSWORD || 'root',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

export const pool = createPool(config);

