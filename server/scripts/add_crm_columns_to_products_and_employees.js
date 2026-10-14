import { sequelize } from '../src/models/index.js';

async function run() {
    try {
        console.log("Adding crm_product_id to products...");
        try {
            await sequelize.query(`
                ALTER TABLE products
                ADD COLUMN crm_product_id INT NULL;
            `);
            console.log("Column crm_product_id added to products.");
        } catch (err) {
            if (err.message.includes('Duplicate column name')) {
                console.log("Column crm_product_id already exists in products.");
            } else {
                throw err;
            }
        }

        console.log("Adding crm_user_id to employees...");
        try {
            await sequelize.query(`
                ALTER TABLE employees
                ADD COLUMN crm_user_id INT NULL;
            `);
            console.log("Column crm_user_id added to employees.");
        } catch (err) {
            if (err.message.includes('Duplicate column name')) {
                console.log("Column crm_user_id already exists in employees.");
            } else {
                throw err;
            }
        }

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await sequelize.close();
    }
}

run();
