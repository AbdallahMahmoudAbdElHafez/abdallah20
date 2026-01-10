import { sequelize } from './src/models/index.js';

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // 1. Add invoice_status column if not exists
        try {
            await sequelize.query("ALTER TABLE sales_invoices ADD COLUMN invoice_status ENUM('draft', 'approved', 'cancelled') NOT NULL DEFAULT 'draft' AFTER invoice_type;");
            console.log('Added invoice_status column.');
        } catch (e) {
            console.log('invoice_status column might already exist or error:', e.message);
        }

        // 2. Add account_id column if not exists
        try {
            await sequelize.query("ALTER TABLE sales_invoices ADD COLUMN account_id INT NULL AFTER status;");
            console.log('Added account_id column.');
        } catch (e) {
            console.log('account_id column might already exist or error:', e.message);
        }

        // 3. Migrate data
        console.log('Migrating existing status data...');
        // If status was 'cancelled', set invoice_status to 'cancelled' and status to 'unpaid' (or keep it, but we'll change enum next)
        await sequelize.query("UPDATE sales_invoices SET invoice_status = 'cancelled' WHERE status = 'cancelled';");
        // For others, assume they were 'approved' if they are already in the system
        await sequelize.query("UPDATE sales_invoices SET invoice_status = 'approved' WHERE status IN ('unpaid', 'paid', 'partial') AND invoice_status = 'draft';");

        // 4. Update status enum
        try {
            await sequelize.query("ALTER TABLE sales_invoices MODIFY COLUMN status ENUM('unpaid', 'paid', 'partial') NOT NULL DEFAULT 'unpaid';");
            console.log('Updated status enum.');
        } catch (e) {
            console.log('Error updating status enum:', e.message);
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
