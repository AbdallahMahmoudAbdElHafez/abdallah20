import {
    sequelize,
    PurchaseInvoice,
    Party,
} from './src/models/index.js';

async function testNullDate() {
    try {
        console.log('🧪 Testing Purchase Invoice with NULL due_date...\n');

        const supplier = await Party.findOne({ where: { party_type: 'supplier' } });
        if (!supplier) {
            console.error('❌ No supplier found');
            return;
        }

        // Test 1: Create invoice with due_date = null
        console.log('📋 Test 1: Creating invoice with due_date = null...');
        const invoice1 = await PurchaseInvoice.create({
            supplier_id: supplier.id,
            invoice_number: `TEST-NULL-${Date.now()}`,
            invoice_date: new Date(),
            due_date: null, // This is what we want to send
            payment_terms: 'Net 30',
            invoice_type: 'normal',
            status: 'unpaid',
            subtotal: 100,
            total_amount: 100,
        });
        console.log(`✅ Invoice 1 created with ID: ${invoice1.id}`);
        console.log(`   Due Date: ${invoice1.due_date}\n`);

        // Test 2: Create invoice with due_date = "" (empty string) - THIS MIGHT FAIL or be converted
        // Note: In the actual app, the frontend might be sending "" which Sequelize or something else converts to "Invalid Date"
        // or MySQL rejects it.
        console.log('📋 Test 2: Creating invoice with due_date = "" (empty string)...');
        try {
            const invoice2 = await PurchaseInvoice.create({
                supplier_id: supplier.id,
                invoice_number: `TEST-EMPTY-${Date.now()}`,
                invoice_date: new Date(),
                due_date: "",
                payment_terms: 'Net 30',
                invoice_type: 'normal',
                status: 'unpaid',
                subtotal: 100,
                total_amount: 100,
            });
            console.log(`✅ Invoice 2 created with ID: ${invoice2.id}`);
            console.log(`   Due Date: ${invoice2.due_date}\n`);
            await invoice2.destroy();
        } catch (err) {
            console.log(`❌ Test 2 Failed as expected (or unexpected): ${err.message}`);
        }

        // Clean up
        await invoice1.destroy();

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await sequelize.close();
    }
}

testNullDate();
