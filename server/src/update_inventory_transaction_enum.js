import { sequelize } from './models/index.js';

async function updateSchema() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableName = 'inventory_transactions';

        console.log(`Updating source_type enum for table: ${tableName}...`);

        // We need to modify the column to include the new enum value
        // Note: modifying ENUMs in MySQL can be tricky. Usually requires redefining the whole column.

        await queryInterface.sequelize.query(`
      ALTER TABLE ${tableName} 
      MODIFY COLUMN source_type 
      ENUM('purchase', 'manufacturing', 'transfer', 'adjustment', 'sales_invoice', 'sales_return', 'purchase_return', 'external_job_order') 
      DEFAULT 'adjustment';
    `);

        console.log("Schema update completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating schema:", error);
        process.exit(1);
    }
}

updateSchema();
