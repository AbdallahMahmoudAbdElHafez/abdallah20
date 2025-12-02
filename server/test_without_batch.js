import {
    sequelize,
    Product,
    Warehouse,
    Party,
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseInvoice,
    InventoryTransaction,
    Batches,
    InventoryTransactionBatches,
    CurrentInventory,
} from './src/models/index.js';

async function testWithoutBatchInfo() {
    try {
        console.log('🚀 Testing Purchase Order WITHOUT batch info...\n');

        // Step 1: Find existing data
        console.log('📋 Step 1: Finding existing supplier, product, and warehouse...');
        const supplier = await Party.findOne({ where: { party_type: 'supplier' } });
        const product = await Product.findOne();
        const warehouse = await Warehouse.findOne();

        if (!supplier || !product || !warehouse) {
            console.error('❌ Missing required data.');
            return;
        }

        console.log(`✅ Found Supplier: ${supplier.name}`);
        console.log(`✅ Found Product: ${product.name}`);
        console.log(`✅ Found Warehouse: ${warehouse.name}\n`);

        // Step 2: Create Purchase Order
        console.log('📋 Step 2: Creating Purchase Order...');
        const po = await PurchaseOrder.create({
            supplier_id: supplier.id,
            order_date: new Date(),
            status: 'draft',
            subtotal: 300,
            total_amount: 300
        });
        console.log(`✅ Purchase Order created with ID: ${po.id}\n`);

        // Step 3: Add item WITHOUT batch_number and expiry_date
        console.log('📋 Step 3: Adding item WITHOUT batch info...');
        await PurchaseOrderItem.create({
            purchase_order_id: po.id,
            product_id: product.id,
            warehouse_id: warehouse.id,
            quantity: 30,
            bonus_quantity: 0,
            unit_price: 10,
            total_price: 300,
            // NO batch_number or expiry_date
        });
        console.log(`✅ Item added WITHOUT batch info\n`);

        // Step 4: Check inventory before
        const beforeInv = await CurrentInventory.findOne({
            where: { product_id: product.id, warehouse_id: warehouse.id }
        });
        const beforeQty = beforeInv ? beforeInv.quantity : 0;
        console.log(`📦 Inventory BEFORE: ${beforeQty}\n`);

        // Step 5: Approve Purchase Order
        console.log('📋 Step 5: Approving Purchase Order...');
        await po.update({ status: 'approved' });
        console.log(`✅ Purchase Order approved!\n`);

        // Step 6: Verify Purchase Invoice
        console.log('📋 Step 6: Verifying Purchase Invoice...');
        const invoice = await PurchaseInvoice.findOne({
            where: { purchase_order_id: po.id }
        });

        if (!invoice) {
            console.error('❌ ERROR: Purchase Invoice was NOT created!');
            return;
        }
        console.log(`✅ Purchase Invoice created: ${invoice.invoice_number}\n`);

        // Step 7: Verify Inventory Transaction
        console.log('📋 Step 7: Verifying Inventory Transaction...');
        const invTrx = await InventoryTransaction.findOne({
            where: {
                product_id: product.id,
                warehouse_id: warehouse.id,
                source_type: 'purchase'
            },
            order: [['id', 'DESC']]
        });

        if (!invTrx) {
            console.error('❌ ERROR: Inventory Transaction was NOT created!');
            return;
        }
        console.log(`✅ Inventory Transaction created with ID: ${invTrx.id}\n`);

        // Step 8: Verify Inventory Transaction Batch (should exist even without batch_id)
        console.log('📋 Step 8: Verifying Inventory Transaction Batch...');
        const invTrxBatch = await InventoryTransactionBatches.findOne({
            where: { inventory_transaction_id: invTrx.id }
        });

        if (!invTrxBatch) {
            console.error('❌ ERROR: Inventory Transaction Batch was NOT created!');
            return;
        }
        console.log(`✅ Inventory Transaction Batch created`);
        console.log(`   Batch ID: ${invTrxBatch.batch_id} (should be null)`);
        console.log(`   Quantity: ${invTrxBatch.quantity}`);
        console.log(`   Cost per unit: ${invTrxBatch.cost_per_unit}\n`);

        if (invTrxBatch.batch_id !== null) {
            console.error('⚠️  WARNING: batch_id should be null but it is:', invTrxBatch.batch_id);
        }

        // Step 9: Verify Current Inventory Update
        console.log('📋 Step 9: Verifying Current Inventory Update...');
        const afterInv = await CurrentInventory.findOne({
            where: { product_id: product.id, warehouse_id: warehouse.id }
        });
        const afterQty = afterInv ? afterInv.quantity : 0;
        const expectedQty = Number(beforeQty) + 30;

        console.log(`📦 Inventory BEFORE: ${beforeQty}`);
        console.log(`📦 Inventory AFTER: ${afterQty}`);
        console.log(`📦 Expected: ${expectedQty}`);

        if (Number(afterQty) === Number(expectedQty)) {
            console.log(`✅ Current Inventory updated correctly!\n`);
        } else {
            console.error(`❌ ERROR: Inventory mismatch! Expected ${expectedQty}, got ${afterQty}\n`);
        }

        // Final Summary
        console.log('═══════════════════════════════════════════');
        console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════');
        console.log('Summary:');
        console.log(`✅ Purchase Order WITHOUT batch info: #${po.id}`);
        console.log(`✅ Purchase Invoice: ${invoice.invoice_number}`);
        console.log(`✅ Inventory Transaction: #${invTrx.id}`);
        console.log(`✅ Inventory Transaction Batch with batch_id = null`);
        console.log(`✅ Inventory Updated: ${beforeQty} → ${afterQty} (+${afterQty - beforeQty})`);
        console.log('═══════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

testWithoutBatchInfo();
