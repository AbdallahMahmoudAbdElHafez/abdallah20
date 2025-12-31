
import InventoryTransactionService from './src/services/inventoryTransaction.service.js';
import { db } from './src/models/index.js';

async function test() {
    try {
        const data = {
            product_id: 1, // Ensure this product exists or change to valid ID
            warehouse_id: 1, // Ensure this warehouse exists
            transaction_type: 'in',
            quantity: 10,
            transaction_date: new Date(),
            batches: [
                {
                    batch_number: 'TEST-BATCH-001-' + Date.now(),
                    expiry_date: '2026-12-31',
                    quantity: 10
                }
            ]
        };

        console.log("Creating transaction with batches:", JSON.stringify(data, null, 2));

        const trx = await InventoryTransactionService.create(data);
        console.log("Transaction created:", trx.id);

        // Now check batches and batch_inventory
        const { Batches, BatchInventory } = await import('./src/models/index.js');

        // Find batch
        const batch = await Batches.findOne({ where: { batch_number: data.batches[0].batch_number } });
        console.log("Found Batch:", batch ? batch.toJSON() : "Not Found");

        if (batch) {
            const batchInv = await BatchInventory.findOne({ where: { batch_id: batch.id, warehouse_id: data.warehouse_id } });
            console.log("Found Batch Inventory:", batchInv ? batchInv.toJSON() : "Not Found");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

test();
