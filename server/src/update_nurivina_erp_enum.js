import { Sequelize } from 'sequelize';
import { env } from './config/env.js';

async function updateSchema() {
    const sequelize = new Sequelize('nurivina_erp', env.db.user, env.db.pass, {
        host: env.db.host,
        port: env.db.port,
        dialect: 'mysql',
        logging: console.log,
    });

    try {
        await sequelize.authenticate();
        console.log('Connected to nurivina_erp database.');

        const queryInterface = sequelize.getQueryInterface();
        const tableName = 'inventory_transactions';

        console.log(`Updating source_type enum for table: ${tableName} in nurivina_erp...`);

        await queryInterface.sequelize.query(`
      ALTER TABLE ${tableName} 
      MODIFY COLUMN source_type 
      ENUM('purchase', 'manufacturing', 'transfer', 'adjustment', 'sales_invoice', 'sales_return', 'purchase_return', 'external_job_order') 
      DEFAULT 'adjustment';
    `);

        console.log("Schema update for nurivina_erp completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating schema:", error);
        process.exit(1);
    }
}

updateSchema();
