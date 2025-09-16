import { JournalEntry, JournalEntryLine, AccountingSetting, ReferenceType } from "../models/index.js";

export async function createPurchaseInvoiceEntry(invoice, transaction) {
    // 1. جلب الحسابات المربوطة بمشتريات المورد
    const purchaseInventoryAccount = await AccountingSetting.findOne({
        where: { operation_type: "purchase_inventory" }
    });

    const purchasePayableAccount = await AccountingSetting.findOne({
        where: { operation_type: "purchase_payable" }
    });
    const purchaseReference = await ReferenceType.findOne({
        where: { code: "purchase_invoice" }
    });

    if (!purchaseInventoryAccount || !purchasePayableAccount) {
        throw new Error("Accounting settings not configured for purchase invoice");
    }

    // 2. إنشاء القيد المحاسبي
    const entry = await JournalEntry.create({
        entry_date: new Date(),
        description: `Purchase Invoice #${invoice.invoice_number}`,
        reference_type_id: purchaseReference.id,
        reference_id: invoice.id// <- هنا

    }, { transaction });

    // 3. إضافة السطور (JournalEntryLine)
    await JournalEntryLine.bulkCreate([
        {
            journal_entry_id: entry.id,
            account_id: purchaseInventoryAccount.account_id,
            debit: invoice.total_amount,
            credit: 0,
            description: "Inventory from purchase invoice"
        },
        {
            journal_entry_id: entry.id,
            account_id: purchasePayableAccount.account_id,
            debit: 0,
            credit: invoice.total_amount,
            description: `Payable to supplier ${invoice.supplier_id}`
        }
    ], { transaction });

    return entry;
}
