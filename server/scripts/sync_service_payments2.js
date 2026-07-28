import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: console.log,
});

async function run() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');

        const [columns] = await sequelize.query(`SHOW COLUMNS FROM service_payments`);
        const columnNames = columns.map(c => c.Field);

        const oldColumns = ['party_id', 'credit_account_id', 'external_job_order_id', 'external_service_id'];
        for (const col of oldColumns) {
            if (columnNames.includes(col)) {
                // First drop any foreign key constraints
                try {
                    const [fks] = await sequelize.query(`
                        SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                        WHERE TABLE_NAME = 'service_payments' AND COLUMN_NAME = '${col}'
                        AND TABLE_SCHEMA = '${env.db.name}'
                        AND REFERENCED_TABLE_NAME IS NOT NULL
                    `);
                    for (const fk of fks) {
                        await sequelize.query(`ALTER TABLE service_payments DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`);
                        console.log(`  Dropped FK ${fk.CONSTRAINT_NAME}`);
                    }
                } catch (e) {
                    console.log(`  No FK to drop for ${col}`);
                }
                
                try {
                    await sequelize.query(`ALTER TABLE service_payments DROP COLUMN ${col}`);
                    console.log(`  ✅ Dropped column: ${col}`);
                } catch (e) {
                    console.log(`  Failed to drop column: ${col}`, e.message);
                }
            }
        }
        console.log('✅ DB sync complete');
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}
run();
