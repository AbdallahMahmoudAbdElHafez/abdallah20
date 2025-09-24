import { Op } from "sequelize";
import { PurchaseInvoice, PurchaseInvoicePayment } from "../models/index.js";

export async function getSupplierStatement(supplierId, { from, to }) {
  const dateFilter = {};
  if (from && to)       dateFilter[Op.between] = [from, to];
  else if (from)        dateFilter[Op.gte] = from;
  else if (to)          dateFilter[Op.lte] = to;

  // 1️⃣ الفواتير
  const invoices = await PurchaseInvoice.findAll({
    where: {
      supplier_id: supplierId,
      ...(Object.keys(dateFilter).length ? { invoice_date: dateFilter } : {}),
    },
    raw: true,
  });

  // 2️⃣ المدفوعات: نستخدم include للوصول للفواتير الخاصة بالمورد
  const payments = await PurchaseInvoicePayment.findAll({
    include: [{
      model: PurchaseInvoice,
      as: "purchase_invoice",          // تأكد أن العلاقة معرفة بهذا الاسم
      where: { supplier_id: supplierId },
      attributes: [],                  // لا نحتاج بيانات الفاتورة نفسها هنا
    }],
    where: Object.keys(dateFilter).length
      ? { payment_date: dateFilter }
      : {},
    raw: true,
  });

  // 3️⃣ دمج الحركات
  const movements = [
    ...invoices.map(inv => ({
      type: "invoice",
      date: inv.invoice_date,
      description: `فاتورة مشتريات #${inv.invoice_number}`,
      debit: Number(inv.total_amount),
      credit: 0,
    })),
    ...payments.map(pay => ({
      type: "payment",
      date: pay.payment_date,
      description: `سداد دفعة لفاتورة #${pay.purchase_invoice_id}`,
      debit: 0,
      credit: Number(pay.amount),
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 4️⃣ حساب الرصيد التراكمي
  let balance = 0;
  const statement = movements.map(row => {
    balance += row.debit - row.credit;
    return { ...row, balance };
  });

  return { supplierId, statement };
}
