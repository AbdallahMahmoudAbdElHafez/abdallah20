
import { sequelize } from '../src/models/index.js';

async function migrate() {
  try {
    console.log('Adding price column to issue_voucher_items table...');
    await sequelize.query(`
      ALTER TABLE issue_voucher_items 
      ADD COLUMN price DECIMAL(12, 2) DEFAULT 0.00 AFTER cost_per_unit;
    `);
    console.log('Column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding column:', error.message);
    process.exit(1);
  }
}

migrate();
