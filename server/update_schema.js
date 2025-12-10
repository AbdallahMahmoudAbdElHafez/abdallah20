import { sequelize } from './src/models/index.js';

async function updateSchema() {
    try {
        console.log("Updating schema...");
        await sequelize.query(`
      ALTER TABLE purchase_invoices 
      MODIFY COLUMN status ENUM('draft', 'unpaid', 'paid', 'partially_paid', 'cancelled', 'approved') 
      NOT NULL DEFAULT 'draft';
    `);
        console.log("Schema updated successfully.");
    } catch (error) {
        console.error("Error updating schema:", error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
