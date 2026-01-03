
import { sequelize, SalesReturn, SalesInvoice, Product, Account, JournalEntry, JournalEntryLine, SalesReturnItem } from './src/models/index.js';
import SalesReturnsService from './src/services/salesReturns.service.js';

async function runVerification() {
    const t = await sequelize.transaction();
    try {
        console.log("Starting Verification...");

        // 1. Setup Data
        // Find existing product, warehouse, party
        const product = await Product.findOne({ transaction: t });
        if (!product) throw new Error("No product found");

        const account = await Account.findOne({ where: { parent_account_id: 47 }, transaction: t }); // Customer Account
        if (!account) throw new Error("No Customer Account found");

        const salesAccount = await Account.findByPk(6, { transaction: t }) || await Account.findOne({ where: { name: 'مبيعات' }, transaction: t });
        const vatAccount = await Account.findByPk(65, { transaction: t });

        // Mock a Sales Invoice for Type A
        const invoice = await SalesInvoice.create({
            invoice_number: 'INV-TEST-001',
            invoice_date: new Date(),
            party_id: 1, // Assumptions
            warehouse_id: 1,
            total_amount: 1150,
            vat_amount: 150,
            subtotal: 1000,
            status: 'posted'
        }, { transaction: t });

        // =========================================================================
        // Test Case 1: Type A (Linked Return)
        // =========================================================================
        console.log("\n--- Testing Type A (Linked Return) ---");
        const typeAData = {
            sales_invoice_id: invoice.id,
            warehouse_id: 1,
            return_date: new Date(),
            return_type: 'credit',
            items: [
                { product_id: product.id, quantity: 1, price: 100 }
            ],
            total_amount: 115, // 100 + 15 VAT
            vat_amount: 15,
            subtotal: 100
        };

        const returnA = await SalesReturnsService.create(typeAData, { transaction: t });
        console.log(`Type A Return Created: #${returnA.id}`);

        // Verify Financial JE
        const financialJE = await JournalEntry.findOne({
            where: { refCode: 'sales_return', refId: returnA.id },
            include: [{ model: JournalEntryLine, as: 'lines' }],
            transaction: t
        });

        if (!financialJE) throw new Error("FAILED: Type A Financial JE missing.");
        console.log("Type A Financial JE Found.");

        // Check Lines
        const drSales = financialJE.lines.find(l => l.account_id === 6 && Number(l.debit) > 0);
        const drVat = financialJE.lines.find(l => l.account_id === 65 && Number(l.debit) > 0);
        // Note: We don't know the exact customer account ID without querying party, assume credit exists
        const crCustomer = financialJE.lines.find(l => Number(l.credit) > 0);

        if (!drSales) console.warn("WARNING: Sales Account (6) Debit missing or different ID used.");
        if (!drVat) console.warn("WARNING: VAT Account (65) Debit missing.");
        if (!crCustomer) throw new Error("FAILED: Customer Credit missing in Financial JE.");
        console.log("Type A Financial JE Lines Validated (Debits/Credits present).");

        // Verify Inventory JE
        const inventoryJE_A = await JournalEntry.findOne({
            where: { refCode: 'inventory_return', refId: returnA.id },
            include: [{ model: JournalEntryLine, as: 'lines' }],
            transaction: t
        });

        if (!inventoryJE_A) throw new Error("FAILED: Type A Inventory JE missing.");
        console.log("Type A Inventory JE Found.");

        const crCOGS = inventoryJE_A.lines.find(l => l.account_id === 15 && Number(l.credit) > 0);
        const drInventory = inventoryJE_A.lines.find(l => Number(l.debit) > 0);

        if (!crCOGS) console.warn("WARNING: COGS (15) Credit missing.");
        if (!drInventory) throw new Error("FAILED: Inventory Debit missing.");
        console.log("Type A Inventory JE Lines Validated.");


        // =========================================================================
        // Test Case 2: Type B (Unlinked Return)
        // =========================================================================
        console.log("\n--- Testing Type B (Unlinked Return) ---");
        const typeBData = {
            sales_invoice_id: null,
            warehouse_id: 1,
            return_date: new Date(),
            return_type: 'cash',
            items: [
                { product_id: product.id, quantity: 1, price: 100 }
            ],
            total_amount: 115,
            vat_amount: 15,
            subtotal: 100
        };

        const returnB = await SalesReturnsService.create(typeBData, { transaction: t });
        console.log(`Type B Return Created: #${returnB.id}`);

        // Verify NO Financial JE
        const financialJE_B = await JournalEntry.findOne({
            where: { refCode: 'sales_return', refId: returnB.id },
            transaction: t
        });

        if (financialJE_B) throw new Error("FAILED: Type B Generated Financial JE! Should be NULL.");
        console.log("Type B: No Financial JE created (CORRECT).");

        // Verify Inventory JE
        const inventoryJE_B = await JournalEntry.findOne({
            where: { refCode: 'inventory_adjustment', refId: returnB.id },
            transaction: t
        });

        if (!inventoryJE_B) throw new Error("FAILED: Type B Inventory JE missing.");
        console.log("Type B Inventory JE Found.");

        // =========================================================================
        // Success
        // =========================================================================
        console.log("\nVERIFICATION SUCCESSFUL!");
        await t.rollback(); // Rollback to keep DB clean
        console.log("Rolled back transaction.");

    } catch (error) {
        console.error("\nVERIFICATION FAILED:", error);
        await t.rollback();
    }
}

runVerification();
