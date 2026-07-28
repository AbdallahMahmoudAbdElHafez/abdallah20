import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: false,
});

async function run() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');

        // Check if service_payment_id exists in cheques
        const [chequeColumns] = await sequelize.query(`SHOW COLUMNS FROM cheques`);
        const chequeColumnNames = chequeColumns.map(c => c.Field);
        
        if (!chequeColumnNames.includes('service_payment_id')) {
            await sequelize.query(`
                ALTER TABLE cheques 
                ADD COLUMN service_payment_id INT NULL,
                ADD FOREIGN KEY (service_payment_id) REFERENCES service_payments(id) ON DELETE SET NULL
            `);
            console.log('✅ Added service_payment_id to cheques');
        } else {
            console.log('✅ service_payment_id already exists in cheques');
        }

        console.log('Done!');
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

run();
