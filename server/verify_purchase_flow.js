
import {
    sequelize,
    Product,
    Warehouse,
    Party,
    PurchaseOrder,
    PurchaseOrderItem,
    InventoryTransaction,
    Batches,
    InventoryTransactionBatches,
    CurrentInventory,
    Unit,
    PartyCategory,
    City,
    Governate,
    Country,
    Account
} from './src/models/index.js';

async function verifyPurchaseFlow() {
    const t = await sequelize.transaction();
    try {
        console.log('Starting verification...');

        // 1. Create Prerequisites
        const unit = await Unit.create({ name: 'Test Unit' }, { transaction: t });
        const product = await Product.create({ name: 'Test Product', unit_id: unit.id, price: 100 }, { transaction: t });

        const country = await Country.create({ name: 'Test Country' }, { transaction: t });
        const governate = await Governate.create({ name: 'Test Gov', country_id: country.id }, { transaction: t });
        const city = await City.create({ name: 'Test City', governate_id: governate.id }, { transaction: t });
        const warehouse = await Warehouse.create({ name: 'Test Warehouse', city_id: city.id }, { transaction: t });

        // Create Account for Supplier
        const account = await Account.create({ name: 'Test Supplier Account', code: '12345', account_type: 'liability' }, { transaction: t });

        const category = await PartyCategory.create({ name: 'Test Category' }, { transaction: t });
        const supplier = await Party.create({
            name: 'Test Supplier',
            category_id: category.id,
            city_id: city.id,
            account_id: account.id, // Ensure supplier has an account
            party_type: 'supplier'
        }, { transaction: t });

        // Create Inventory Account if not exists (needed for purchaseInvoiceHooks)
        await Account.findOrCreate({
            where: { name: 'المخزون' },
            defaults: { code: '11111', account_type: 'asset' },
            transaction: t
        });

        // 2. Create Purchase Order
        const po = await PurchaseOrder.create({
            supplier_id: supplier.id,
            order_date: new Date(),
            status: 'draft',
            subtotal: 100,
            total_amount: 100
        }, { transaction: t });

        await PurchaseOrderItem.create({
            purchase_order_id: po.id,
            product_id: product.id,
            warehouse_id: warehouse.id,
            quantity: 10,
            unit_price: 10,
            total_price: 100,
            batch_number: 'BATCH-001',
            expiry_date: '2025-12-31'
        }, { transaction: t });

        console.log('Purchase Order created:', po.id);

        // 3. Approve Purchase Order
        // We need to commit the transaction so hooks can run in their own transaction or we pass the transaction?
        // The hooks usually run in the same transaction if passed in options.
        // However, purchaseOrderHooks.js uses `afterUpdate` and expects `options.transaction`.

        await po.update({ status: 'approved' }, { transaction: t });
        console.log('Purchase Order approved');

        // 4. Verify Inventory Transaction
        const trx = await InventoryTransaction.findOne({
            where: {
                source_type: 'purchase',
                // We need to find the transaction related to the item. 
                // The hook creates transaction with source_id = item.id.
                // But we don't have the item ID easily here unless we query it back.
            },
            include: [
                { model: InventoryTransactionBatches, as: 'transaction_batches' }
            ],
            transaction: t
        });

        // Since we just created one, let's query by product and warehouse
        const trxs = await InventoryTransaction.findAll({
            where: { product_id: product.id, warehouse_id: warehouse.id },
            include: [{ model: InventoryTransactionBatches, as: 'transaction_batches' }],
            transaction: t
        });

        if (trxs.length === 0) {
            throw new Error('No InventoryTransaction created!');
        }

        const transaction = trxs[0];
        console.log('Inventory Transaction found:', transaction.id);

        // 5. Verify Batches
        if (!transaction.transaction_batches || transaction.transaction_batches.length === 0) {
            throw new Error('No InventoryTransactionBatches created!');
        }

        const trxBatch = transaction.transaction_batches[0];
        console.log('Transaction Batch found:', trxBatch.batch_id);

        const batch = await Batches.findByPk(trxBatch.batch_id, { transaction: t });
        if (!batch) throw new Error('Batch not found!');

        if (batch.batch_number !== 'BATCH-001') throw new Error(`Batch number mismatch! Expected BATCH-001, got ${batch.batch_number}`);
        console.log('Batch verified:', batch.batch_number);

        // 6. Verify Current Inventory
        const currentInv = await CurrentInventory.findOne({
            where: { product_id: product.id, warehouse_id: warehouse.id },
            transaction: t
        });

        if (!currentInv) throw new Error('CurrentInventory not found!');
        if (Number(currentInv.quantity) !== 10) throw new Error(`CurrentInventory quantity mismatch! Expected 10, got ${currentInv.quantity}`);
        console.log('CurrentInventory verified:', currentInv.quantity);

        console.log('ALL CHECKS PASSED!');

        // Rollback to clean up
        await t.rollback();
        console.log('Rolled back transaction.');

    } catch (error) {
        console.error('Verification Failed:', error);
        await t.rollback();
        process.exit(1);
    }
}

verifyPurchaseFlow();
