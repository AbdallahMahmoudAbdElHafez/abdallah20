
import { sequelize } from './models/index.js';
import WarehouseTransferItemModel from './models/warehouseTransferItems.model.js';

async function updateSchema() {
    try {
        const WarehouseTransferItem = WarehouseTransferItemModel(sequelize);
        console.log('Syncing WarehouseTransferItem model...');
        await WarehouseTransferItem.sync({ alter: true });
        console.log('WarehouseTransferItem model synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing model:', error);
        process.exit(1);
    }
}

updateSchema();
