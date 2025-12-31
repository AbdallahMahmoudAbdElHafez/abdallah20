
import InventoryTransactionService from './src/services/inventoryTransaction.service.js';
import { sequelize, Product, Warehouse, Batches, BatchInventory } from './src/models/index.js';

async function test() {
    try {
        // Ensure we have a product and warehouse
        let product = await Product.findOne();
        if (!product) {
            console.log("No product found, creating one...");
            // Assume min required fields
            product = await Product.create({ name_ar: 'Test Product', name_en: 'Test Product', type_id: 1 });
        }
        let warehouse = await Warehouse.findOne();
        if (!warehouse) {
            console.log("No warehouse found, creating one...");
            warehouse = await Warehouse.create({ name_ar: 'Test Warehouse', name_en: 'Test Warehouse' });
        }

        const data = {
            product_id: product.id,
            warehouse_id: warehouse.id,
            transaction_type: 'in',
            quantity: 10,
            transaction_date: new Date(),
            batches: [
                {
                    batch_number: 'TEST-BATCH-' + Date.now(),
                    expiry_date: '2026-12-31',
                    quantity: 10
                }
            ]
        };

        console.log("Creating transaction with batches:", JSON.stringify(data, null, 2));

        const trx = await InventoryTransactionService.create(data);
        console.log("Transaction created:", trx.id);

        // Now check batches and batch_inventory
        const batch = await Batches.findOne({ where: { batch_number: data.batches[0].batch_number } });
        console.log("Found Batch:", batch ? batch.toJSON() : "Not Found");

        if (batch) {
            const batchInv = await BatchInventory.findOne({ where: { batch_id: batch.id, warehouse_id: data.warehouse_id } });
            console.log("Found Batch Inventory:", batchInv ? batchInv.toJSON() : "Not Found");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

test();
