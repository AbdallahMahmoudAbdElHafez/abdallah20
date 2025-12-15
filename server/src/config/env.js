
import dotenv from 'dotenv';
dotenv.config();


export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        pass: process.env.DB_PASS || 'Abdallah20203040',
        name: process.env.DB_NAME || 'nurivina_erp',
    },

};