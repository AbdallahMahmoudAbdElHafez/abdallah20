import { sequelize } from './src/models/index.js';

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // Update source_type ENUM in inventory_transactions table
        await sequelize.query("ALTER TABLE inventory_transactions MODIFY COLUMN source_type ENUM('purchase', 'manufacturing', 'transfer', 'adjustment', 'sales_invoice', 'sales_return', 'purchase_return') DEFAULT 'adjustment';");

        console.log('Successfully updated source_type ENUM.');
    } catch (error) {
        console.error('Error updating database:', error);
    } finally {
        await sequelize.close();
    }
})();
