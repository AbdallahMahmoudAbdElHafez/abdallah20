import { createJournalEntry } from "../services/journal.service.js";

const createPurchaseJournalEntry = async (invoice, models, options) => {
  const t = options.transaction;
  const { ReferenceType, Account, Party } = models;

  try {
    // 1. Ensure Reference Type exists
    let refType = await ReferenceType.findOne({ where: { code: 'purchase_invoice' }, transaction: t });
    if (!refType) {
      refType = await ReferenceType.create({
        code: 'purchase_invoice',
        name: 'فاتورة مشتريات',
        label: 'فاتورة مشتريات',
        description: 'قيود فواتير المشتريات'
      }, { transaction: t });
    }

    // حساب المخزون
    const inventoryAccount = await Account.findOne({
      where: { name: "المخزون" },
      transaction: t
    });
    if (!inventoryAccount) {
      console.warn("حساب 'المخزون' غير موجود. skipping journal entry.");
      return;
    }

    // حساب المورد
    const supplier = await Party.findByPk(invoice.supplier_id, { transaction: t });
    if (!supplier?.account_id) {
      console.warn("Supplier account not found. skipping journal entry.");
      return;
    }

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

    console.log(`Journal Entry created for Purchase Invoice #${invoice.id}`);
  } catch (error) {
    console.error("Error in createPurchaseJournalEntry:", error);
    throw error;
  }
};

export default function purchaseInvoiceHooks(sequelize) {
  const { PurchaseInvoice, ReferenceType, Account, Party } = sequelize.models;

  PurchaseInvoice.afterUpdate(async (invoice, options) => {
    if (invoice.changed('status') && invoice.status === 'approved') {
      await createPurchaseJournalEntry(invoice, { ReferenceType, Account, Party }, options);
    }
  });

  PurchaseInvoice.afterCreate(async (invoice, options) => {
    if (invoice.status === 'approved') {
      await createPurchaseJournalEntry(invoice, { ReferenceType, Account, Party }, options);
    }
  });
}
