import { Op } from "sequelize";
import { PurchaseInvoice, PurchaseInvoicePayment, Party } from "../models/index.js";

export async function getSupplierStatement(supplierId, { from, to }) {
  const supplier = await Party.findByPk(supplierId, {
    attributes: ["id", "name", "email", "phone"],
  });
  if (!supplier) throw new Error("Supplier not found");

  // فلتر التواريخ
  const dateFilter = {};
  if (from && to) dateFilter[Op.between] = [from, to];
  else if (from) dateFilter[Op.gte] = from;
  else if (to) dateFilter[Op.lte] = to;

  // 1️⃣ الفواتير
  const invoices = await PurchaseInvoice.findAll({
    where: {
      supplier_id: supplierId,
      ...(Object.keys(dateFilter).length ? { invoice_date: dateFilter } : {}),
    },
    raw: true,
  });

  // 2️⃣ المدفوعات
  const payments = await PurchaseInvoicePayment.findAll({
    include: [{
      model: PurchaseInvoice,
      as: "purchase_invoice",
      where: { supplier_id: supplierId },
      attributes: [],
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
      description: inv.invoice_type === 'opening'
        ? `رصيد افتتاحي (فاتورة #${inv.invoice_number})`
        : `فاتورة مشتريات #${inv.invoice_number}`,
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

  // 4️⃣ حساب الرصيد التراكمي والختامي
  let runningBalance = 0;
  const statement = movements.map(row => {
    runningBalance += row.debit - row.credit;
    return { ...row, running_balance: runningBalance };
  });

  // لو تريد رصيد افتتاحي قبل الفترة (اختياري)
  let openingBalance = 0;
  if (from) {
    const prevInvoices = await PurchaseInvoice.sum("total_amount", {
      where: { supplier_id: supplierId, invoice_date: { [Op.lt]: from } },
    });

    const prevPayments = await PurchaseInvoicePayment.sum("amount", {
      where: {
        payment_date: { [Op.lt]: from },
      },
      include: [{
        model: PurchaseInvoice,
        as: "purchase_invoice",
        required: true,
        where: { supplier_id: supplierId },
        attributes: [], // ⬅ يمنع إدخال أعمدة إضافية في SELECT
      }],
    });

    openingBalance = (prevInvoices || 0) - (prevPayments || 0);
  }

  const closingBalance = openingBalance + runningBalance;

  return {
    supplier,
    opening_balance: openingBalance,
    closing_balance: closingBalance,
    statement,
  };
}
