import { sequelize } from './models/index.js';

async function updateSchema() {
  try {
    const tableName = 'inventory_transactions';
    console.log(`Checking and updating schema for table: ${tableName}...`);

    // 1. Check if account_id column exists
    const [columns] = await sequelize.query(`SHOW COLUMNS FROM ${tableName} LIKE 'account_id'`);
    if (columns.length === 0) {
      console.log(`Adding account_id column to ${tableName}...`);
      await sequelize.query(`
        ALTER TABLE ${tableName}
        ADD COLUMN account_id INT NULL AFTER source_id,
        ADD CONSTRAINT fk_inv_trx_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('account_id column added successfully.');
    } else {
      console.log('account_id column already exists.');
    }

    // 2. Modify source_type ENUM to include 'manufacturing_waste'
    console.log(`Updating source_type ENUM...`);
    await sequelize.query(`
      ALTER TABLE ${tableName} 
      MODIFY COLUMN source_type 
      ENUM('purchase', 'manufacturing', 'transfer', 'adjustment', 'sales_invoice', 'sales_return', 'purchase_return', 'external_job_order', 'issue_voucher', 'issue_voucher_return', 'opening', 'manufacturing_waste') 
      DEFAULT 'adjustment'
    `);
    console.log('source_type ENUM updated successfully.');

    // 3. Ensure ReferenceType 'manufacturing_scrap' exists
    const [refTypes] = await sequelize.query(`SELECT id FROM reference_types WHERE code = 'manufacturing_scrap'`);
    if (refTypes.length === 0) {
      console.log('Creating reference_type for manufacturing_scrap...');
      await sequelize.query(`
        INSERT INTO reference_types (code, label, description)
        VALUES ('manufacturing_scrap', 'هالك تصنيع', 'Manufacturing Waste / Scrap')
      `);
      console.log('reference_type created.');
    } else {
      console.log('reference_type manufacturing_scrap already exists.');
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
