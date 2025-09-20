import { sequelize, PurchaseInvoicePayment, PurchaseInvoice } from "../models/index.js";
import { createJournalEntry } from "./journal.service.js";

export async function createPayment(data) {
  const t = await sequelize.transaction();
  try {
    // 1️⃣ اجلب الفاتورة للتحقق من المبلغ
    const invoice = await PurchaseInvoice.findByPk(data.purchase_invoice_id, { transaction: t });
    if (!invoice) throw new Error("Invoice not found");

    // اجمع ما تم دفعه سابقاً
    const totalPaid = await PurchaseInvoicePayment.sum("amount", {
      where: { purchase_invoice_id: invoice.id },
      transaction: t
    });

    // احسب المبلغ المتبقي
    const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
    if (Number(data.amount) > remaining) {
      throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
    }

    // 2️⃣ أنشئ الدفعة
    const payment = await PurchaseInvoicePayment.create(data, { transaction: t });

    // 3️⃣ أضف قيد اليومية كما في السابق
    await createJournalEntry({
      refCode: "purchase_invoice",
      refId: payment.id,
      entryDate: payment.payment_date,
      description: `سداد فاتورة مشتريات #${invoice.id}`,
      lines: [
        {
          account_id: invoice.supplier.account_id,
          debit: data.amount,
          credit: 0,
          description: "تخفيض التزامات المورد"
        },
        {
          account_id: data.account_id,
          debit: 0,
          credit: data.amount,
          description: "خروج من الصندوق/البنك"
        }
      ]
    }, { transaction: t });

    // 4️⃣ تحديث حالة الفاتورة
    const newPaid = totalPaid + Number(data.amount);
    const newStatus =
      newPaid >= invoice.total_amount ? "paid"
      : newPaid > 0 ? "partially_paid"
      : invoice.status;

    if (newStatus !== invoice.status) {
      await invoice.update({ status: newStatus }, { transaction: t });
    }

    await t.commit();
    return payment;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
