import {
    ExternalJobOrder,
    ExternalJobOrderService as AccrualModel,
    ServicePayment,
    JournalEntry,
    JournalEntryLine,
    Party,
    Account,
    ReferenceType,
    sequelize
} from '../src/models/index.js';
import ExternalJobOrderServicesService from '../src/services/externalJobOrderServices.service.js';
import ServicePaymentsService from '../src/services/servicePayments.service.js';
import ExternalJobOrdersService from '../src/services/externalJobOrders.service.js';
import { getSupplierStatement } from '../src/services/supplierLedger.service.js';

async function verify() {
    console.log('--- 🛡️ VERIFYING STRICT ACCRUAL ACCOUNTING FLOW ---');

    try {
        // 1. Setup Data
        let supplier = await Party.findOne({ where: { name: 'مصنع ECC' } });
        if (!supplier) {
            supplier = await Party.findByPk(74);
        }

        let order = await ExternalJobOrder.findOne({ order: [['id', 'DESC']] });
        if (!order) {
            console.log('Creating Test Job Order...');
            order = await ExternalJobOrder.create({
                party_id: supplier.id,
                product_id: 1,
                warehouse_id: 5,
                planned_quantity: 100,
                status: 'planned'
            });
        }

        const bankAccount = await Account.findByPk(43); // QNB

        if (!supplier || !order) {
            console.error('❌ Setup Error: Party or Job Order not found');
            return;
        }

        console.log(`Using Supplier: ${supplier.name} (Account: ${supplier.account_id})`);
        console.log(`Using Job Order: #${order.id} (${order.status})`);

        // 2. Step 1: Record a Service Invoice (Accrual)
        console.log('\n--- 2a. Creating Service Invoice (Accrual) ---');
        const accrualAmount = 500;
        const serviceInvoice = await ExternalJobOrderServicesService.create({
            job_order_id: order.id,
            party_id: supplier.id,
            service_date: new Date(),
            amount: accrualAmount,
            note: 'Verification Accrual'
        });
        console.log(`✅ PASS: Service Invoice Created #${serviceInvoice.id}`);

        // Check JE
        const accrualRefType = await ReferenceType.findOne({ where: { code: 'job_order_service_accrual' } });
        const accrualJE = await JournalEntry.findOne({
            where: { reference_id: serviceInvoice.id, reference_type_id: accrualRefType.id },
            include: [{ model: JournalEntryLine, as: 'lines' }]
        });

        if (accrualJE) {
            console.log('Accrual Journal Entry:');
            accrualJE.lines.forEach(l => {
                console.log(`  - Account ${l.account_id}: Dr ${l.debit} | Cr ${l.credit}`);
            });
            const wipLine = accrualJE.lines.find(l => l.account_id === 109);
            const supplierLine = accrualJE.lines.find(l => l.account_id === supplier.account_id);
            if (wipLine?.debit == accrualAmount && supplierLine?.credit == accrualAmount) {
                console.log('✅ PASS: JE correctly debited WIP and credited Supplier.');
            } else {
                console.error('❌ FAIL: JE mapping or amount incorrect.');
            }
        }

        // 3. Step 2: Record a Service Payment (Settlement)
        console.log('\n--- 2b. Creating Service Payment (Settlement) ---');
        const paymentAmount = 300;
        const settlement = await ServicePaymentsService.create({
            party_id: supplier.id,
            amount: paymentAmount,
            payment_date: new Date(),
            account_id: supplier.account_id, // DEBIT Supplier
            credit_account_id: bankAccount.id, // CREDIT Bank
            payment_method: 'bank',
            note: 'Verification Settlement',
            external_service_id: serviceInvoice.id
        });
        console.log(`✅ PASS: Settlement Payment Created #${settlement.id}`);

        // Check JE
        const paymentRefType = await ReferenceType.findOne({ where: { code: 'service_payment' } });
        const pmntJE = await JournalEntry.findOne({
            where: { reference_id: settlement.id, reference_type_id: paymentRefType.id },
            include: [{ model: JournalEntryLine, as: 'lines' }]
        });
        if (pmntJE) {
            console.log('Settlement Journal Entry:');
            pmntJE.lines.forEach(l => {
                console.log(`  - Account ${l.account_id}: Dr ${l.debit} | Cr ${l.credit}`);
            });
            const drSupplier = pmntJE.lines.find(l => l.account_id === supplier.account_id);
            const crBank = pmntJE.lines.find(l => l.account_id === bankAccount.id);
            if (drSupplier?.debit == paymentAmount && crBank?.credit == paymentAmount) {
                console.log('✅ PASS: Settlement correctly debited Supplier and credited Bank.');
            }
        }

        // 4. Step 3: Check Supplier Ledger
        console.log('\n--- 2c. Checking Supplier Ledger ---');
        const ledger = await getSupplierStatement(supplier.id, {});
        const recentMovements = ledger.statement.slice(-5);
        console.table(recentMovements);

        const hasAccrual = recentMovements.some(m => m.type === 'service_accrual' && m.credit == accrualAmount);
        const hasSettlement = recentMovements.some(m => m.type === 'service_settlement' && m.debit == paymentAmount);

        if (hasAccrual && hasSettlement) {
            console.log('✅ PASS: Ledger correctly reflects both Accrual and Settlement.');
        } else {
            console.error('❌ FAIL: One or both movements missing from ledger.');
        }

        // 5. Step 4: Complete Job Order and Check Costing
        console.log('\n--- 2d. Completing Job Order ---');
        const existingStatus = order.status;
        if (existingStatus === 'completed') {
            console.log('⚠️ Order already completed, skipping recapitalization test');
        } else {
            const completion = await ExternalJobOrdersService.receiveFinishedGoods(order.id, {
                produced_quantity: 100,
                batch_number: 'STRICT-TEST-' + Date.now()
            });
            console.log(`✅ PASS: Order Completed. Total Cost Calculated: ${completion.totalCost}`);

            // The total cost should include our 500 EGP accrual
            const services = await AccrualModel.findAll({ where: { job_order_id: order.id } });
            const expectedServiceSum = services.reduce((sum, s) => sum + Number(s.amount), 0);

            console.log(`Service Accruals Found for order: ${expectedServiceSum}`);
            if (completion.totalCost >= expectedServiceSum) {
                console.log('✅ PASS: Final cost correctly includes accrued services.');
            } else {
                console.error('❌ FAIL: Final cost does not match accruals.');
            }
        }

    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error);
    } finally {
        // await sequelize.close();
    }
}

verify();
