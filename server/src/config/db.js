import { Sequelize } from 'sequelize';
import { env } from './env.js';


export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
host: env.db.host,
port: env.db.port,
dialect: 'mysql',
logging: false,
define: { timestamps: false }, // سنحدد الحقول يدوياً
});


export async function testConnection() {
try {
await sequelize.authenticate();
console.log('✅ Database connected');
} catch (err) {
console.error('❌ DB connection error:', err.message);
process.exit(1);
}
}