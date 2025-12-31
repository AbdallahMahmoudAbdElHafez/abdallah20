
import InventoryTransactionService from './src/services/inventoryTransaction.service.js';
import { sequelize, Product, Warehouse, Batches, BatchInventory } from './src/models/index.js';

async function test() {
    try {
        // Ensure we have a product and warehouse
        let product = await Product.findOne();
        if (!product) {
            product = await Product.create({ name_ar: 'Test Product', name_en: 'Test Product', type_id: 1 });
        }
        let warehouse = await Warehouse.findOne();
        if (!warehouse) {
            warehouse = await Warehouse.create({ name_ar: 'Test Warehouse', name_en: 'Test Warehouse' });
        }

        const flatData = {
            product_id: product.id,
            warehouse_id: warehouse.id,
            transaction_type: 'in',
            quantity: 15,
            transaction_date: new Date(),
            // Flat batch fields
            batch_number: 'FLAT-BATCH-' + Date.now(),
            expiry_date: '2027-01-01'
        };

        console.log("Creating transaction with FLAT batch fields:", JSON.stringify(flatData, null, 2));

        const trx = await InventoryTransactionService.create(flatData);
        console.log("Transaction created:", trx.id);

        // Now check batches and batch_inventory
        const batch = await Batches.findOne({ where: { batch_number: flatData.batch_number } });
        console.log("Found Batch:", batch ? batch.toJSON() : "Not Found");

        if (batch) {
            const batchInv = await BatchInventory.findOne({ where: { batch_id: batch.id, warehouse_id: flatData.warehouse_id } });
            console.log("Found Batch Inventory:", batchInv ? batchInv.toJSON() : "Not Found");
        } else {
            console.log("Batch NOT found!");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

test();
