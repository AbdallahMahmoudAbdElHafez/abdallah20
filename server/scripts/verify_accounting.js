
import {
    sequelize,
    Party,
    Product,
    Account,
    ExternalJobOrder,
    ExternalJobOrderItem,
    ServicePayment,
    JournalEntry,
    JournalEntryLine,
    Warehouse,
    InventoryTransaction
} from '../src/models/index.js';
import ExternalJobOrdersService from '../src/services/externalJobOrders.service.js';
import ServicePaymentsService from '../src/services/servicePayments.service.js';
import { getSupplierStatement } from '../src/services/supplierLedger.service.js';

async function verifyAccounting() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Setup Data
        console.log('\n--- 1. Setting up Test Data ---');
        const supplier = await Party.findOne({ where: { party_type: 'supplier' } });
        const product = await Product.findOne();
        const warehouse = await Warehouse.findOne();
        const wipAccount = await Account.findByPk(109);

        // Find Accounts based on user provided IDs
        const bankAccount = await Account.findByPk(43); // QNB (Asset)
        const supplierAccount = await Account.findByPk(supplier.account_id); // Supplier Liability Account

        console.log(`Supplier: ${supplier.name} (ID: ${supplier.id}, Account: ${supplier.account_id})`);
        console.log(`Product: ${product.name} (ID: ${product.id})`);
        console.log(`WIP Account: ${wipAccount?.name} (ID: ${wipAccount?.id})`);
        console.log(`Bank Account: ${bankAccount?.name} (ID: ${bankAccount?.id}, Type: ${bankAccount?.account_type})`);
        console.log(`Supplier Account: ${supplierAccount?.name} (ID: ${supplierAccount?.id}, Type: ${supplierAccount?.account_type})`);

        // 2. Create Job Order
        console.log('\n--- 2. Create Job Order ---');
        const order = await ExternalJobOrdersService.create({
            party_id: supplier.id,
            product_id: product.id,
            warehouse_id: warehouse.id,
            order_quantity: 10,
            start_date: new Date(),
            status: 'planned'
        });
        console.log(`Job Order Created: #${order.id}`);

        // 3. Issue Materials (Simulate)
        // Create dummy inventory first to avoid errors
        await InventoryTransaction.create({
            product_id: product.id,
            warehouse_id: warehouse.id,
            transaction_type: 'in',
            quantity: 100,
            transaction_date: new Date(),
            source_type: 'opening',
            source_id: 0,
            batches: [{ batch_number: 'TEST-BATCH', quantity: 100, cost_per_unit: 10 }]
        });

        console.log('\n--- 3. Sending Materials (10 units @ 10 EGP = 100 EGP) ---');
        await ExternalJobOrdersService.sendMaterials(order.id, [{
            product_id: product.id,
            warehouse_id: warehouse.id,
            quantity: 10
        }]);

        // Check Journal Entry
        await checkJournalEntries(order.id, 'Material Issue');


        // 4. Service Payment 1: Accrual (Credit Supplier)
        console.log('\n--- 4. Service Payment (Accrual - Credit Supplier 200 EGP) ---');
        await ServicePaymentsService.create({
            external_job_order_id: order.id,
            party_id: supplier.id,
            amount: 200,
            payment_date: new Date(),
            account_id: 109, // WIP (Will be forced anyway)
            credit_account_id: supplier.account_id, // Liability
            payment_method: 'other',
            note: 'Test Accrual'
        });
        await checkJournalEntries(order.id, 'Service Payment (Accrual)');


        // 5. Service Payment 2: Cash (Credit Bank)
        console.log('\n--- 5. Service Payment (Cash - Credit Bank 50 EGP) ---');
        await ServicePaymentsService.create({
            external_job_order_id: order.id,
            party_id: supplier.id,
            amount: 50,
            payment_date: new Date(),
            account_id: 109, // WIP
            credit_account_id: bankAccount.id, // Asset
            payment_method: 'bank',
            note: 'Test Cash'
        });
        await checkJournalEntries(order.id, 'Service Payment (Cash)');


        // 6. Complete Job Order
        console.log('\n--- 6. Complete Job Order (Receive Finished Goods) ---');
        await ExternalJobOrdersService.receiveFinishedGoods(order.id, {
            produced_quantity: 10,
            waste_quantity: 0
        });
        await checkJournalEntries(order.id, 'Completion');

        // 7. Check Supplier Ledger
        console.log('\n--- 7. Supplier Ledger Check ---');
        const ledger = await getSupplierStatement(supplier.id, {});
        const ourTransactions = ledger.statement.filter(s => s.description.includes('Test Accrual') || s.description.includes('Test Cash'));
        console.log('Relevant Ledger Entries:');
        console.table(ourTransactions);

        // 8. Late Payment Test (Completed Order)
        console.log('\n--- 8. Late Payment Test (Order Completed) ---');

        // 8a. Try with WIP (Should Fail)
        try {
            console.log('Attempting Late Payment with WIP (Expect Error)...');
            await ServicePaymentsService.create({
                external_job_order_id: order.id,
                party_id: supplier.id,
                amount: 100,
                payment_date: new Date(),
                account_id: 109, // WIP
                credit_account_id: supplier.account_id,
                payment_method: 'other',
                note: 'Late Payment WIP'
            });
            console.error('❌ FAIL: Should have blocked WIP on completed order');
        } catch (e) {
            console.log('✅ PASS: Blocked WIP usage:', e.message);
        }

        // 8b. Try with Expense (Should Success)
        console.log('Attempting Late Payment with Expense (Expect Success)...');
        const expenseAccount = await Account.findOne({ where: { account_type: 'expense' } }); // e.g., General Expense
        if (expenseAccount) {
            const latePayment = await ServicePaymentsService.create({
                external_job_order_id: order.id,
                party_id: supplier.id,
                amount: 150,
                payment_date: new Date(),
                account_id: expenseAccount.id, // Expense
                credit_account_id: supplier.account_id,
                payment_method: 'other',
                note: 'Late Payment Expense'
            });
            console.log(`✅ PASS: Created Late Payment #${latePayment.id} with Account ${expenseAccount.name}`);
            await checkJournalEntries(order.id, 'Late Payment (Expense)');
        } else {
            console.warn('⚠️ SKIP: No expense account found for test');
        }

        // 9. Settlement Test (Pay Supplier Balance)
        console.log('\n--- 9. Settlement Test (Dr Supplier / Cr Bank) ---');
        // This is where the user was having trouble.
        // We want topay the 200 EGP accrual we made in Step 4.
        const settlementPayment = await ServicePaymentsService.create({
            party_id: supplier.id,
            amount: 150,
            payment_date: new Date(),
            account_id: supplier.account_id, // DEBIT: Supplier (Settlement)
            credit_account_id: bankAccount.id, // CREDIT: Bank
            payment_method: 'bank',
            note: 'Settlement Payment'
        });
        console.log(`✅ PASS: Created Settlement Payment #${settlementPayment.id}`);

        // Final Ledger Check
        console.log('\n--- 10. Final Supplier Ledger Check ---');
        const finalLedger = await getSupplierStatement(supplier.id, {});
        const finalTransactions = finalLedger.statement.filter(s =>
            s.description.includes('Test Accrual') ||
            s.description.includes('Settlement Payment')
        );
        console.log('Final Relevant Ledger Entries:');
        console.table(finalTransactions);
        console.log(`Final Statement Closing Balance: ${finalLedger.closing_balance}`);

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        // Cleanup if needed, but for now we leave data for inspection
        process.exit();
    }
}

async function checkJournalEntries(refId, stepName) {
    // Note: We might need to look for specific reference types or just latest entries
    const jes = await JournalEntry.findAll({
        where: { reference_id: refId },
        include: [{ model: JournalEntryLine, as: 'lines' }],
        order: [['id', 'DESC']]
    });

    // Also check for Service Payments linked to this order
    const payments = await ServicePayment.findAll({ where: { external_job_order_id: refId } });
    const paymentIds = payments.map(p => p.id);
    const paymentJes = await JournalEntry.findAll({
        where: { reference_id: paymentIds, reference_type_id: 28 },
        include: [{ model: JournalEntryLine, as: 'lines' }]
    });

    console.log(`\n[${stepName}] Journal Entries Found:`);
    const allJes = [...jes];

    // Query recently created JEs
    const recentJes = await JournalEntry.findAll({
        limit: 5,
        order: [['id', 'DESC']],
        include: [{ model: JournalEntryLine, as: 'lines' }]
    });

    recentJes.forEach(je => {
        console.log(`JE #${je.id} (${je.description}):`);
        je.lines.forEach(line => {
            console.log(`  - Account ID ${line.account_id}: Dr ${line.debit} | Cr ${line.credit}`);
        });
    });
}

verifyAccounting();
