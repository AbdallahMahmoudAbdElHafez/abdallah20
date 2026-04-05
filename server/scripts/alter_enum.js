import { sequelize } from '../src/models/index.js';

async function run() {
    try {
        await sequelize.query(`
            ALTER TABLE inventory_transactions 
            MODIFY source_type ENUM('purchase', 'manufacturing', 'transfer', 'adjustment', 'sales_invoice', 'sales_return', 'purchase_return', 'external_job_order', 'issue_voucher', 'issue_voucher_return', 'opening') 
            DEFAULT 'adjustment';
        `);
        console.log("Done altering source_type ENUM");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
