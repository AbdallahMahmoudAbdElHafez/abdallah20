// add_invoice_id_to_service_payments.js
// Run: node src/add_invoice_id_to_service_payments.js
import { sequelize } from "./models/index.js";

async function migrate() {
    try {
        console.log("Adding external_service_invoice_id column to service_payments...");

        // Check if column exists
        const [columns] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'service_payments' 
            AND COLUMN_NAME = 'external_service_invoice_id'
        `);

        if (columns.length === 0) {
            await sequelize.query(`
                ALTER TABLE service_payments 
                ADD COLUMN external_service_invoice_id INT NULL
            `);

            await sequelize.query(`
                ALTER TABLE service_payments 
                ADD CONSTRAINT fk_service_payments_invoice 
                    FOREIGN KEY (external_service_invoice_id) 
                    REFERENCES external_service_invoices(id) 
                    ON DELETE SET NULL
            `);

            console.log("Column added successfully!");
        } else {
            console.log("Column already exists, skipping.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exit(1);
    }
}

migrate();
