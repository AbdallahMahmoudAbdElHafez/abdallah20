
import { sequelize, ServicePayment } from './src/models/index.js';

async function createTable() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync the model
        // Using alter: true to update if exists (though error said it doesn't), or create if missing.
        await ServicePayment.sync({ alter: true });
        console.log('ServicePayment table created/updated successfully.');

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        await sequelize.close();
    }
}

createTable();
