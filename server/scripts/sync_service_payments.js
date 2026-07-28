// Script to sync service_payments table and related changes
// Run: node --experimental-modules server/scripts/sync_service_payments.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: console.log,
    }
);

async function run() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');

        // 1. Check if service_payments table exists and its current columns
        const [columns] = await sequelize.query(`SHOW COLUMNS FROM service_payments`).catch(() => [[]]);
        const columnNames = columns.map(c => c.Field);
        console.log('Current service_payments columns:', columnNames);

        if (columnNames.length === 0) {
            // Table doesn't exist, create it
            console.log('Creating service_payments table...');
            await sequelize.query(`
                CREATE TABLE service_payments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    external_service_invoice_id INT NOT NULL,
                    amount DECIMAL(12,2) NOT NULL,
                    payment_date DATE DEFAULT (CURRENT_DATE),
                    payment_method ENUM('cash','bank','cheque','other') DEFAULT 'cash',
                    reference_number VARCHAR(255) NULL,
                    account_id INT NOT NULL,
                    employee_id INT NULL,
                    note TEXT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (external_service_invoice_id) REFERENCES external_service_invoices(id),
                    FOREIGN KEY (account_id) REFERENCES accounts(id),
                    FOREIGN KEY (employee_id) REFERENCES employees(id)
                )
            `);
            console.log('✅ service_payments table created');
        } else {
            // Table exists, check if we need to alter it
            console.log('Table exists, checking for needed alterations...');

            // Check for old columns that need to be dropped
            const oldColumns = ['party_id', 'credit_account_id', 'external_job_order_id', 'external_service_id'];
            for (const col of oldColumns) {
                if (columnNames.includes(col)) {
                    // First drop any foreign key constraints
                    try {
                        const [fks] = await sequelize.query(`
                            SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                            WHERE TABLE_NAME = 'service_payments' AND COLUMN_NAME = '${col}'
                            AND TABLE_SCHEMA = '${process.env.DB_NAME}'
                            AND REFERENCED_TABLE_NAME IS NOT NULL
                        `);
                        for (const fk of fks) {
                            await sequelize.query(`ALTER TABLE service_payments DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`);
                            console.log(`  Dropped FK ${fk.CONSTRAINT_NAME}`);
                        }
                    } catch (e) {
                        console.log(`  No FK to drop for ${col}`);
                    }
                    await sequelize.query(`ALTER TABLE service_payments DROP COLUMN ${col}`);
                    console.log(`  ✅ Dropped column: ${col}`);
                }
            }

            // Check if external_service_invoice_id exists
            if (!columnNames.includes('external_service_invoice_id')) {
                await sequelize.query(`
                    ALTER TABLE service_payments 
                    ADD COLUMN external_service_invoice_id INT NOT NULL,
                    ADD FOREIGN KEY (external_service_invoice_id) REFERENCES external_service_invoices(id)
                `);
                console.log('  ✅ Added external_service_invoice_id column');
            } else {
                // Make sure it's NOT NULL
                console.log('  external_service_invoice_id already exists');
            }

            // Ensure note column exists
            if (!columnNames.includes('note')) {
                await sequelize.query(`ALTER TABLE service_payments ADD COLUMN note TEXT NULL`);
                console.log('  ✅ Added note column');
            }
        }

        // 2. Update external_service_invoices.status ENUM
        console.log('\nUpdating external_service_invoices.status ENUM...');
        try {
            await sequelize.query(`
                ALTER TABLE external_service_invoices 
                MODIFY COLUMN status ENUM('Draft','Posted','Cancelled','Partially Paid','Paid') DEFAULT 'Draft'
            `);
            console.log('✅ Updated external_service_invoices.status ENUM');
        } catch (e) {
            console.log('Status ENUM may already be correct:', e.message);
        }

        // 3. Ensure cheques.service_payment_id column exists
        console.log('\nChecking cheques.service_payment_id...');
        const [chequeColumns] = await sequelize.query(`SHOW COLUMNS FROM cheques`);
        const chequeColumnNames = chequeColumns.map(c => c.Field);
        if (!chequeColumnNames.includes('service_payment_id')) {
            await sequelize.query(`
                ALTER TABLE cheques 
                ADD COLUMN service_payment_id INT NULL,
                ADD FOREIGN KEY (service_payment_id) REFERENCES service_payments(id)
            `);
            console.log('✅ Added service_payment_id to cheques');
        } else {
            console.log('✅ service_payment_id already exists in cheques');
        }

        console.log('\n🎉 All migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

run();
