import {
    sequelize,
    PurchaseInvoice,
    Party,
} from './src/models/index.js';
import { getSupplierStatement } from './src/services/supplierLedger.service.js';

async function testLedgerDescription() {
    try {
        console.log('🧪 Testing Supplier Ledger Description...\n');

        const supplier = await Party.findOne({ where: { party_type: 'supplier' } });
        if (!supplier) {
            console.error('❌ No supplier found');
            return;
        }

        // Create Normal Invoice
        const normalInvoice = await PurchaseInvoice.create({
            supplier_id: supplier.id,
            invoice_number: `TEST-NORM-${Date.now()}`,
            invoice_date: new Date(),
            due_date: null,
            payment_terms: 'Net 30',
            invoice_type: 'normal',
            status: 'unpaid',
            subtotal: 100,
            total_amount: 100,
        });

        // Create Opening Invoice
        const openingInvoice = await PurchaseInvoice.create({
            supplier_id: supplier.id,
            invoice_number: `TEST-OPEN-${Date.now()}`,
            invoice_date: new Date(),
            due_date: null,
            payment_terms: 'Opening',
            invoice_type: 'opening',
            status: 'unpaid',
            subtotal: 500,
            total_amount: 500,
        });

        console.log('📋 Created test invoices.');

        // Fetch Statement
        const statement = await getSupplierStatement(supplier.id, {});

        console.log('\n📊 Ledger Statement Items:');
        const relevantItems = statement.statement.filter(item =>
            item.description.includes(normalInvoice.invoice_number) ||
            item.description.includes(openingInvoice.invoice_number)
        );

        relevantItems.forEach(item => {
            console.log(`   - Date: ${item.date}, Description: "${item.description}", Debit: ${item.debit}`);
        });

        // Verify
        const normalItem = relevantItems.find(i => i.description.includes(normalInvoice.invoice_number));
        const openingItem = relevantItems.find(i => i.description.includes(openingInvoice.invoice_number));

        if (normalItem && normalItem.description.startsWith('فاتورة مشتريات')) {
            console.log('\n✅ Normal Invoice Description Correct');
        } else {
            console.log('\n❌ Normal Invoice Description Incorrect');
        }

        if (openingItem && openingItem.description.startsWith('رصيد افتتاحي')) {
            console.log('✅ Opening Invoice Description Correct');
        } else {
            console.log('❌ Opening Invoice Description Incorrect');
        }

        // Clean up
        await normalInvoice.destroy();
        await openingInvoice.destroy();

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

testLedgerDescription();
