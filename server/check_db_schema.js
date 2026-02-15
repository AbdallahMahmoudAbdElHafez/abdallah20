import { sequelize } from './src/models/index.js';

async function checkTable() {
    try {
        const [results] = await sequelize.query("DESCRIBE service_payments");
        console.log("Current columns in service_payments:");
        console.table(results);

        const [results2] = await sequelize.query("DESCRIBE purchase_invoice_payments");
        console.log("Current columns in purchase_invoice_payments:");
        console.table(results2);

        process.exit(0);
    } catch (error) {
        console.error("Error checking table:", error);
        process.exit(1);
    }
}

checkTable();
