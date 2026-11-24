
import dotenv from 'dotenv';
dotenv.config();

const clean = (val) => (typeof val === 'string' ? val.trim() : val);
const dbPort = Number(clean(process.env.DB_PORT) || 3306);

export const env = {
    nodeEnv: clean(process.env.NODE_ENV) || 'development',
    port: Number(clean(process.env.PORT) || 5000),
    isVercel: Boolean(process.env.VERCEL),
    db: {
        host: clean(process.env.DB_HOST) || 'localhost',
        port: dbPort,
        user: clean(process.env.DB_USER || process.env.DB_USERNAME) || 'root',
        pass: clean(process.env.DB_PASS || process.env.DB_PASSWORD) || 'Abdallah20203040',
        name: clean(process.env.DB_NAME || process.env.DB_DATABASE) || 'nurivina_erp',
        ssl:
            clean(process.env.DB_SSL) === 'true' ||
            dbPort === 4000 ||
            (clean(process.env.DB_HOST) || '').includes('tidbcloud.com'),
    },
    dbMgmtPassword: clean(process.env.DB_MGMT_PASSWORD) || 'Abdallah20203040',
};