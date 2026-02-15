import { sequelize } from './src/models/index.js';

async function checkServicePayments() {
    try {
        const [results] = await sequelize.query("DESCRIBE service_payments");
        console.log("COLUMNS IN service_payments:");
        results.forEach(col => {
            console.log(`${col.Field}: ${col.Type}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkServicePayments();
