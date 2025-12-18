import { sequelize, PurchaseInvoice, SalesInvoice, IssueVoucher, Account, JournalEntry, JournalEntryLine, Party, Warehouse, Product, Employee, ReferenceType } from '../models/index.js';
import PurchaseInvoiceService from '../services/purchaseInvoices.service.js';
import SalesInvoiceService from '../services/salesInvoices.service.js';
import { IssueVouchersService } from '../services/issueVouchers.service.js';

sequelize.options.logging = false;

async function verify() {
    const t = await sequelize.transaction();
    try {
        console.log('--- START VERIFICATION ---');

        // 1. Setup Data
        const supplier = await Party.findOne({ where: { party_type: 'supplier' }, transaction: t }) || await Party.create({ name: 'Test Supplier', party_type: 'supplier', phone: '123' }, { transaction: t });
        const customer = await Party.findOne({ where: { party_type: 'customer' }, transaction: t }) || await Party.create({ name: 'Test Customer', party_type: 'customer', phone: '456' }, { transaction: t });
        const warehouse = await Warehouse.findOne({ transaction: t }) || await Warehouse.create({ name: 'Test Warehouse' }, { transaction: t });
        let product = await Product.findOne({ where: { cost_price: { [sequelize.Sequelize.Op.gt]: 0 } }, transaction: t });
        if (!product) {
            product = await Product.create({ name: 'Test Product', price: 100, cost_price: 50 }, { transaction: t });
        }
        console.log(`Product: ${product.name}, Cost: ${product.cost_price}`);

        // 2. Test Purchase Invoice
        console.log('\n[TEST] Purchase Invoice');
        const piData = {
            supplier_id: supplier.id,
            warehouse_id: warehouse.id,
            invoice_date: new Date(),
            invoice_type: 'normal',
            subtotal: 1000,
            vat_amount: 150,
            total_amount: 1150,
            additional_discount: 0,
            tax_amount: 0,
            items: [
                { product_id: product.id, quantity: 10, unit_price: 100, bonus_quantity: 0 }
            ]
        };
        const createdPI = await PurchaseInvoiceService.create(piData, { transaction: t });
        console.log(`PI Created: ID ${createdPI.id}`);

        const piRefType = await ReferenceType.findOne({ where: { code: 'purchase_invoice' }, transaction: t });
        if (piRefType) {
            const piEntry = await JournalEntry.findOne({
                where: { reference_type_id: piRefType.id, reference_id: createdPI.id },
                include: [JournalEntryLine],
                transaction: t
            });
            if (piEntry) {
                console.log('✅ PI Journal Entry Found!');
                piEntry.JournalEntryLines.forEach(l => console.log(`   ${l.debit > 0 ? 'Dr' : 'Cr'} Account ${l.account_id}: ${l.debit > 0 ? l.debit : l.credit}`));
            } else {
                console.error('❌ PI Journal Entry MISSING');
            }
        } else {
            console.error('❌ PI Reference Type Missing');
        }

        // 3. Test Sales Invoice
        console.log('\n[TEST] Sales Invoice');
        const siData = {
            party_id: customer.id,
            warehouse_id: warehouse.id,
            invoice_date: new Date(),
            invoice_type: 'normal',
            subtotal: 200,
            vat_amount: 30,
            total_amount: 230,
            items: [
                { product_id: product.id, quantity: 2, price: 100, bonus: 0 }
            ]
        };
        const createdSI = await SalesInvoiceService.create(siData, { transaction: t });
        console.log(`SI Created: ID ${createdSI.id}`);

        const siRefType = await ReferenceType.findOne({ where: { code: 'sales_invoice' }, transaction: t });
        if (siRefType) {
            const siEntry = await JournalEntry.findOne({
                where: { reference_type_id: siRefType.id, reference_id: createdSI.id },
                include: [JournalEntryLine],
                transaction: t
            });
            if (siEntry) {
                console.log('✅ SI Revenue JE Found!');
                siEntry.JournalEntryLines.forEach(l => console.log(`   ${l.debit > 0 ? 'Dr' : 'Cr'} Account ${l.account_id}: ${l.debit > 0 ? l.debit : l.credit}`));
            } else {
                console.error('❌ SI Revenue JE MISSING');
            }
        }

        const cogsRefType = await ReferenceType.findOne({ where: { code: 'sales_invoice_cost' }, transaction: t });
        if (cogsRefType) {
            const cogsEntry = await JournalEntry.findOne({
                where: { reference_type_id: cogsRefType.id, reference_id: createdSI.id },
                include: [JournalEntryLine],
                transaction: t
            });
            if (cogsEntry) {
                console.log('✅ SI COGS JE Found!');
                cogsEntry.JournalEntryLines.forEach(l => console.log(`   ${l.debit > 0 ? 'Dr' : 'Cr'} Account ${l.account_id}: ${l.debit > 0 ? l.debit : l.credit}`));
            } else {
                console.log('⚠️ SI COGS JE Missing (Cost might be 0?)');
            }
        }

        // 4. Test Issue Voucher
        console.log('\n[TEST] Issue Voucher');
        const ivService = new IssueVouchersService();
        const expenseAccount = await Account.findByPk(1, { transaction: t }) ||
            await Account.findOne({ transaction: t });

        if (expenseAccount) {
            const ivData = {
                voucher_no: `IV-Verify-${Date.now()}`,
                issue_date: new Date(),
                warehouse_id: warehouse.id,
                account_id: expenseAccount.id,
                status: 'draft'
            };
            const ivItems = [
                { product_id: product.id, quantity: 1 }
            ];

            const createdIV = await ivService.createIssueVoucherWithItems(ivData, ivItems);
            console.log(`IV Created: ID ${createdIV.id}`);

            const ivRefType = await ReferenceType.findOne({ where: { code: 'issue_voucher' }, transaction: t });

            if (ivRefType) {
                const ivEntry = await JournalEntry.findOne({
                    where: { reference_type_id: ivRefType.id, reference_id: createdIV.id },
                    include: [JournalEntryLine]
                });

                if (ivEntry) {
                    console.log('✅ IV Journal Entry Found!');
                    ivEntry.JournalEntryLines.forEach(l => console.log(`   ${l.debit > 0 ? 'Dr' : 'Cr'} Account ${l.account_id}: ${l.debit > 0 ? l.debit : l.credit}`));

                    // Cleanup IV
                    await ivService.deleteIssueVoucher(createdIV.id);
                    try { await JournalEntry.destroy({ where: { id: ivEntry.id } }); } catch { }
                } else {
                    console.error('❌ IV Journal Entry MISSING');
                }
            }
        }

        console.log('\n--- VERIFICATION FINISHED ---\n');
        await t.rollback();

    } catch (error) {
        console.error('Verification Failed:', error);
        try { await t.rollback(); } catch { }
    } finally {
        process.exit();
    }
}

verify();
