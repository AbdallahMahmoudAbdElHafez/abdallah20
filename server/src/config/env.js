
import dotenv from 'dotenv';
dotenv.config();

const dbPort = Number(process.env.DB_PORT || 3306);

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    isVercel: Boolean(process.env.VERCEL),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: dbPort,
        user: process.env.DB_USER || 'root',
        pass: process.env.DB_PASS || 'Abdallah20203040',
        name: process.env.DB_NAME || 'nurivina_erp',
        ssl: process.env.DB_SSL === 'true' || dbPort === 4000,
    },
    dbMgmtPassword: process.env.DB_MGMT_PASSWORD || 'Abdallah20203040',
};