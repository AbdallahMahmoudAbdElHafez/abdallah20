import { createJournalEntry } from "../services/journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";

// Inventory Account IDs by Product Type
const INVENTORY_ACCOUNTS = {
  FINISHED_GOODS: 110,    // مخزون تام الصنع (منتج تام - type_id: 1)
  RAW_MATERIALS: 111,     // مخزون أولي (مستلزم انتاج - type_id: 2)
  DEFAULT: 49             // المخزون (fallback)
};

const PRODUCT_TYPE_TO_ACCOUNT = {
  1: INVENTORY_ACCOUNTS.FINISHED_GOODS,  // منتج تام
  2: INVENTORY_ACCOUNTS.RAW_MATERIALS    // مستلزم انتاج
};

const createPurchaseJournalEntry = async (invoice, models, options) => {
  const t = options.transaction;
  const { ReferenceType, Account, Party, PurchaseInvoiceItem, Product } = models;

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

    // 2. Get invoice items with product details
    const invoiceItems = await PurchaseInvoiceItem.findAll({
      where: { purchase_invoice_id: invoice.id },
      include: [{ model: Product, as: 'product' }],
      transaction: t
    });

    // 3. Group amounts by product type
    const amountsByType = {};
    for (const item of invoiceItems) {
      const typeId = item.product?.type_id || null;
      const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

      if (!amountsByType[accountId]) {
        amountsByType[accountId] = 0;
      }
      amountsByType[accountId] += parseFloat(item.total_price || 0);
    }

    // 4. Get supplier account
    const supplier = await Party.findByPk(invoice.supplier_id, { transaction: t });
    if (!supplier?.account_id) {
      console.warn("Supplier account not found. skipping journal entry.");
      return;
    }

    // 5. Build journal entry lines
    const lines = [];

    // Add debit lines for each inventory account
    for (const [accountId, amount] of Object.entries(amountsByType)) {
      if (amount > 0) {
        const account = await Account.findByPk(accountId, { transaction: t });
        lines.push({
          account_id: parseInt(accountId),
          debit: amount,
          credit: 0,
          description: `إضافة للمخزون - ${account?.name || 'مخزون'}`
        });
      }
    }

    // Add credit line for supplier
    lines.push({
      account_id: supplier.account_id,
      debit: 0,
      credit: invoice.total_amount,
      description: "حساب المورد (أجل)"
    });

    // 6. Create journal entry
    await createJournalEntry({
      refCode: "purchase_invoice",
      refId: invoice.id,
      entryDate: invoice.invoice_date || new Date(),
      description: `اعتماد فاتورة مشتريات #${invoice.id}`,
      entryTypeId: ENTRY_TYPES.PURCHASE_INVOICE,
      lines
    }, { transaction: t });

    console.log(`Journal Entry created for Purchase Invoice #${invoice.id} with ${lines.length - 1} inventory accounts`);
  } catch (error) {
    console.error("Error in createPurchaseJournalEntry:", error);
    throw error;
  }
};

export default function purchaseInvoiceHooks(sequelize) {
  const { PurchaseInvoice, ReferenceType, Account, Party, PurchaseInvoiceItem, Product } = sequelize.models;

  PurchaseInvoice.afterUpdate(async (invoice, options) => {
    if (invoice.changed('status') && invoice.status === 'approved') {
      await createPurchaseJournalEntry(invoice, { ReferenceType, Account, Party, PurchaseInvoiceItem, Product }, options);
    }
  });

  PurchaseInvoice.afterCreate(async (invoice, options) => {
    if (invoice.status === 'approved') {
      await createPurchaseJournalEntry(invoice, { ReferenceType, Account, Party, PurchaseInvoiceItem, Product }, options);
    }
  });
}
