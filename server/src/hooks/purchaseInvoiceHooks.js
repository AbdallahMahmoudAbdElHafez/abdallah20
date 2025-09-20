import { PurchaseInvoice, Party, Account } from "../models/index.js";
import { createJournalEntry } from "../services/journal.service.js";

export default function purchaseInvoiceHooks() {
  PurchaseInvoice.afterUpdate(async (invoice, options) => {
    if (!invoice.changed('status') || invoice.status !== 'approved') return;
    const t = options.transaction;

    // حساب المخزون (يمكنك تغييره حسب تسميتك)
    const inventoryAccount = await Account.findOne({
      where: { name: "المخزون" },
      transaction: t
    });
    if (!inventoryAccount) throw new Error("حساب 'مخزون' غير موجود");

    // حساب المورد
    const supplier = await Party.findByPk(invoice.supplier_id, { transaction: t });
    if (!supplier?.account_id) throw new Error("Supplier account not found");

    await createJournalEntry({
      refCode: "purchase_invoice",
      refId: invoice.id,
      entryDate: invoice.invoice_date || new Date(),
      description: `اعتماد فاتورة مشتريات #${invoice.id}`,
      lines: [
        { account_id: inventoryAccount.id, debit: invoice.total_amount, credit: 0, description: "إضافة للمخزون" },
        { account_id: supplier.account_id, debit: 0, credit: invoice.total_amount, description: "حساب المورد (أجل)" }
      ]
    }, { transaction: t });
  });

  
}
