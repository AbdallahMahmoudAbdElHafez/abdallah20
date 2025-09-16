import { PurchaseInvoice } from "../models/index.js";
import { createPurchaseInvoiceEntry } from "../services/journalService.js";

export default function purchaseInvoiceHooks() {
  PurchaseInvoice.afterCreate(async (invoice, options) => {
    const t = options.transaction;

    try {
      await createPurchaseInvoiceEntry(invoice, t);
    } catch (err) {
      console.error("⚠️ خطأ أثناء إنشاء القيد المحاسبي لفاتورة المشتريات:", err);
    }
  });
}
