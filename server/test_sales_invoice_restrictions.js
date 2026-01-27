import { sequelize, SalesInvoice, SalesInvoiceItem } from './src/models/index.js';
import SalesInvoiceService from './src/services/salesInvoices.service.js';

async function testRestrictions() {
    let invoiceId;
    let draftInvoice2Id;

    try {
        console.log('--- Starting Sales Invoice Restriction Tests ---');

        // 1. Create a Draft Invoice
        console.log('\n1. Creating Draft Invoice...');
        const invoiceData = {
            invoice_number: `TEST-RESTRICT-${Date.now()}`,
            party_id: 1, // Assuming customer exists
            warehouse_id: 1, // Assuming warehouse exists
            employee_id: 1,
            invoice_date: new Date(),
            invoice_type: 'normal',
            invoice_status: 'draft',
            items: [
                {
                    product_id: 1, // Assuming product exists
                    quantity: 1,
                    price: 100
                }
            ]
        };

        const createdInvoice = await SalesInvoiceService.create(invoiceData);
        invoiceId = createdInvoice.id;
        console.log(`   Created Invoice ID: ${invoiceId}, Status: ${createdInvoice.invoice_status}`);

        // 2. Update Draft Invoice (Should Succeed)
        console.log('\n2. Testing Update on Draft Invoice (Should Succeed)...');
        await SalesInvoiceService.update(invoiceId, {
            ...invoiceData,
            note: 'Updated Note'
        });
        const updatedInvoice = await SalesInvoiceService.getById(invoiceId);
        if (updatedInvoice.note === 'Updated Note') {
            console.log('   SUCCESS: Draft invoice updated successfully.');
        } else {
            console.error('   FAILURE: Draft invoice update failed.');
        }

        // 3. Approve Invoice
        console.log('\n3. Approving Invoice...');
        // We need to update directly via model or service to change status to approved
        // The service update might have logic, but let's try via service first as it's draft
        await SalesInvoiceService.update(invoiceId, {
            ...invoiceData,
            invoice_status: 'approved'
        });
        const approvedInvoice = await SalesInvoiceService.getById(invoiceId);
        console.log(`   Invoice Status: ${approvedInvoice.invoice_status}`);

        // 4. Try to Update Approved Invoice (Should Fail)
        console.log('\n4. Testing Update on Approved Invoice (Should Fail)...');
        try {
            await SalesInvoiceService.update(invoiceId, {
                note: 'Illegal Update'
            });
            console.error('   FAILURE: Approved invoice update SHOULD have failed but succeeded.');
        } catch (error) {
            console.log(`   SUCCESS: Caught expected error: ${error.message}`);
        }

        // 5. Try to Delete Approved Invoice (Should Fail)
        console.log('\n5. Testing Delete on Approved Invoice (Should Fail)...');
        try {
            await SalesInvoiceService.delete(invoiceId);
            console.error('   FAILURE: Approved invoice delete SHOULD have failed but succeeded.');
        } catch (error) {
            console.log(`   SUCCESS: Caught expected error: ${error.message}`);
        }

        // 6. Create another Draft Invoice to test Delete on Draft
        console.log('\n6. Testing Delete on Draft Invoice (Should Fail)...');
        const draftInvoice2 = await SalesInvoiceService.create({
            ...invoiceData,
            invoice_number: `TEST-RESTRICT-2-${Date.now()}`
        });
        draftInvoice2Id = draftInvoice2.id;

        try {
            await SalesInvoiceService.delete(draftInvoice2Id);
            console.error('   FAILURE: Draft invoice delete SHOULD have failed but succeeded.');
        } catch (error) {
            console.log(`   SUCCESS: Caught expected error: ${error.message}`);
        }

    } catch (error) {
        console.error('Test Script Error:', error);
    } finally {
        // Clean up test data directly via Model (bypassing service restrictions)
        console.log('\n--- Cleaning Up ---');
        if (invoiceId) {
            await SalesInvoiceItem.destroy({ where: { sales_invoice_id: invoiceId } });
            await SalesInvoice.destroy({ where: { id: invoiceId } });
            console.log(`   Deleted test invoice ${invoiceId}`);
        }
        if (draftInvoice2Id) {
            await SalesInvoiceItem.destroy({ where: { sales_invoice_id: draftInvoice2Id } });
            await SalesInvoice.destroy({ where: { id: draftInvoice2Id } });
            console.log(`   Deleted test invoice ${draftInvoice2Id}`);
        }

        console.log('--- Test Finished ---');
        process.exit();
    }
}

testRestrictions();
