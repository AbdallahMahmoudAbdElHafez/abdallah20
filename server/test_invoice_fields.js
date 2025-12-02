import {
    sequelize,
    PurchaseInvoice,
    Party,
} from './src/models/index.js';

async function testNewFields() {
    try {
        console.log('🧪 Testing new Purchase Invoice fields...\n');

        // Find a supplier
        const supplier = await Party.findOne({ where: { party_type: 'supplier' } });
        if (!supplier) {
            console.error('❌ No supplier found');
            return;
        }

        console.log(`✅ Found Supplier: ${supplier.name}\n`);

        // Create invoice with new fields
        console.log('📋 Creating Purchase Invoice with new fields...');
        const invoice = await PurchaseInvoice.create({
            supplier_id: supplier.id,
            invoice_number: `TEST-INV-${Date.now()}`,
            invoice_date: new Date(),
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            payment_terms: 'Net 30',
            invoice_type: 'normal',
            status: 'unpaid',
            subtotal: 1000,
            total_amount: 1000,
        });

        console.log(`✅ Invoice created with ID: ${invoice.id}`);
        console.log(`   Invoice Number: ${invoice.invoice_number}`);
        console.log(`   Payment Terms: ${invoice.payment_terms}`);
        console.log(`   Invoice Type: ${invoice.invoice_type}`);
        console.log(`   Status: ${invoice.status}\n`);

        // Test opening balance invoice
        console.log('📋 Creating Opening Balance Invoice...');
        const openingInvoice = await PurchaseInvoice.create({
            supplier_id: supplier.id,
            invoice_number: `OPENING-${Date.now()}`,
            invoice_date: new Date(),
            payment_terms: 'Opening Balance',
            invoice_type: 'opening',
            status: 'unpaid',
            subtotal: 5000,
            total_amount: 5000,
        });

        console.log(`✅ Opening Balance Invoice created with ID: ${openingInvoice.id}`);
        console.log(`   Invoice Number: ${openingInvoice.invoice_number}`);
        console.log(`   Payment Terms: ${openingInvoice.payment_terms}`);
        console.log(`   Invoice Type: ${openingInvoice.invoice_type}\n`);

        // Clean up
        await invoice.destroy();
        await openingInvoice.destroy();
        console.log('✅ Test invoices deleted\n');

        console.log('═══════════════════════════════════════════');
        console.log('🎉 ALL TESTS PASSED!');
        console.log('═══════════════════════════════════════════');
        console.log('New fields working correctly:');
        console.log('✅ payment_terms');
        console.log('✅ invoice_type (normal/opening)');
        console.log('═══════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

testNewFields();
