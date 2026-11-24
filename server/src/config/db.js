import _sequelizePkg from 'sequelize';
const { Sequelize } = _sequelizePkg;
import mysql2 from 'mysql2';
import { env } from './env.js';

const dialectOptions = env.db.ssl
    ? {
          ssl: {
              minVersion: 'TLSv1.2',
              rejectUnauthorized: true,
          },
      }
    : {};

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    dialectModule: mysql2,
    dialectOptions,
    logging: false,
    define: { timestamps: false }, // سنحدد الحقول يدوياً
    pool: {
        max: env.isVercel ? 5 : 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
    } catch (err) {
        console.error('❌ DB connection error:', err.message);
        if (!env.isVercel) {
            process.exit(1);
        }
        throw err;
    }
}