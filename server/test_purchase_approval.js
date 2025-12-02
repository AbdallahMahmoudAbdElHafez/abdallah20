import {
    sequelize,
    Product,
    Warehouse,
    Party,
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseInvoice,
    PurchaseInvoiceItem,
    InventoryTransaction,
    Batches,
    InventoryTransactionBatches,
    CurrentInventory,
} from './src/models/index.js';

async function testPurchaseApproval() {
    try {
        console.log('🚀 Starting Purchase Order Approval Test...\n');

        // Step 1: Find existing data
        console.log('📋 Step 1: Finding existing supplier, product, and warehouse...');
        const supplier = await Party.findOne({ where: { party_type: 'supplier' } });
        const product = await Product.findOne();
        const warehouse = await Warehouse.findOne();

        if (!supplier || !product || !warehouse) {
            console.error('❌ Missing required data. Please ensure you have at least one supplier, product, and warehouse.');
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
            subtotal: 500,
            total_amount: 500
        });
        console.log(`✅ Purchase Order created with ID: ${po.id}\n`);

        // Step 3: Add items to Purchase Order
        console.log('📋 Step 3: Adding items with batch info...');
        const batchNumber = `BATCH-TEST-${Date.now()}`;
        const expiryDate = '2026-12-31';

        await PurchaseOrderItem.create({
            purchase_order_id: po.id,
            product_id: product.id,
            warehouse_id: warehouse.id,
            quantity: 50,
            bonus_quantity: 5,
            unit_price: 10,
            total_price: 500,
            batch_number: batchNumber,
            expiry_date: expiryDate
        });
        console.log(`✅ Item added with batch: ${batchNumber}\n`);

        // Step 4: Check inventory before approval
        console.log('📋 Step 4: Checking inventory BEFORE approval...');
        const beforeInv = await CurrentInventory.findOne({
            where: { product_id: product.id, warehouse_id: warehouse.id }
        });
        const beforeQty = beforeInv ? beforeInv.quantity : 0;
        console.log(`📦 Inventory BEFORE: ${beforeQty}\n`);

        // Step 5: Approve Purchase Order
        console.log('📋 Step 5: Approving Purchase Order...');
        await po.update({ status: 'approved' });
        console.log(`✅ Purchase Order approved!\n`);

        // Step 6: Verify Purchase Invoice was created
        console.log('📋 Step 6: Verifying Purchase Invoice...');
        const invoice = await PurchaseInvoice.findOne({
            where: { purchase_order_id: po.id },
            include: ['items']
        });

        if (!invoice) {
            console.error('❌ ERROR: Purchase Invoice was NOT created!');
            return;
        }
        console.log(`✅ Purchase Invoice created: ${invoice.invoice_number}`);
        console.log(`✅ Invoice items count: ${invoice.items?.length || 0}\n`);

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
        console.log(`✅ Inventory Transaction created with ID: ${invTrx.id}`);
        console.log(`   Type: ${invTrx.transaction_type}`);
        console.log(`   Note: ${invTrx.note}\n`);

        // Step 8: Verify Batch
        console.log('📋 Step 8: Verifying Batch...');
        const batch = await Batches.findOne({
            where: {
                product_id: product.id,
                batch_number: batchNumber
            }
        });

        if (!batch) {
            console.error('❌ ERROR: Batch was NOT created!');
            return;
        }
        console.log(`✅ Batch created with ID: ${batch.id}`);
        console.log(`   Batch Number: ${batch.batch_number}`);
        console.log(`   Expiry Date: ${batch.expiry_date}\n`);

        // Step 9: Verify Inventory Transaction Batch
        console.log('📋 Step 9: Verifying Inventory Transaction Batch...');
        const invTrxBatch = await InventoryTransactionBatches.findOne({
            where: {
                inventory_transaction_id: invTrx.id,
                batch_id: batch.id
            }
        });

        if (!invTrxBatch) {
            console.error('❌ ERROR: Inventory Transaction Batch was NOT created!');
            return;
        }
        console.log(`✅ Inventory Transaction Batch created`);
        console.log(`   Quantity: ${invTrxBatch.quantity}`);
        console.log(`   Cost per unit: ${invTrxBatch.cost_per_unit}\n`);

        // Step 10: Verify Current Inventory Update
        console.log('📋 Step 10: Verifying Current Inventory Update...');
        const afterInv = await CurrentInventory.findOne({
            where: { product_id: product.id, warehouse_id: warehouse.id }
        });
        const afterQty = afterInv ? afterInv.quantity : 0;
        const expectedQty = Number(beforeQty) + 50 + 5; // quantity + bonus

        console.log(`📦 Inventory BEFORE: ${beforeQty}`);
        console.log(`📦 Inventory AFTER: ${afterQty}`);
        console.log(`📦 Expected: ${expectedQty}`);

        if (Number(afterQty) === Number(expectedQty)) {
            console.log(`✅ Current Inventory updated correctly!\n`);
        } else {
            console.error(`❌ ERROR: Current Inventory mismatch! Expected ${expectedQty}, got ${afterQty}\n`);
        }

        // Final Summary
        console.log('═══════════════════════════════════════════');
        console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════');
        console.log('Summary:');
        console.log(`✅ Purchase Order: #${po.id}`);
        console.log(`✅ Purchase Invoice: ${invoice.invoice_number}`);
        console.log(`✅ Inventory Transaction: #${invTrx.id}`);
        console.log(`✅ Batch: ${batch.batch_number}`);
        console.log(`✅ Inventory Updated: ${beforeQty} → ${afterQty} (+${afterQty - beforeQty})`);
        console.log('═══════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

testPurchaseApproval();
