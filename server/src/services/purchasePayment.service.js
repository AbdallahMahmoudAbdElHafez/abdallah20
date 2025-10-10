import { sequelize, PurchaseInvoicePayment, PurchaseInvoice, Party } from "../models/index.js";
import { createJournalEntry } from "./journal.service.js";
import { Op } from "sequelize"; // 👈 مهم جداً

export async function createPayment(data) {
  const t = await sequelize.transaction();
  try {
    // 1️⃣ اجلب الفاتورة مع بيانات المورد
    const invoice = await PurchaseInvoice.findByPk(data.purchase_invoice_id, {
      include: [{ model: Party, as: "supplier" }],
      transaction: t,
    });
    if (!invoice) throw new Error("Invoice not found");

    // 2️⃣ إجمالي المدفوعات السابقة
    const totalPaid = await PurchaseInvoicePayment.sum("amount", {
      where: { purchase_invoice_id: invoice.id },
      transaction: t,
    });

    // 3️⃣ تحقق من المبلغ
    const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
    if (Number(data.amount) > remaining) {
      throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
    }

    // 4️⃣ أنشئ الدفعة
    const payment = await PurchaseInvoicePayment.create(data, { transaction: t });

    // 5️⃣ قيد اليومية
    if (!invoice.supplier?.account_id) {
      throw new Error("Supplier does not have a linked account_id");
    }

    await createJournalEntry(
      {
        refCode: "purchase_invoice",
        refId: payment.id,
        entryDate: payment.payment_date,
        description: `سداد فاتورة مشتريات #${invoice.invoice_number}`,
        lines: [
          {
            account_id: invoice.supplier.account_id,
            debit: Number(data.amount),
            credit: 0,
            description: "تخفيض التزامات المورد",
          },
          {
            account_id: data.account_id,
            debit: 0,
            credit: Number(data.amount),
            description: "خروج من الصندوق/البنك",
          },
        ],
      },
      { transaction: t }
    );

    // 6️⃣ تحديث حالة الفاتورة
    const newPaid = Number(totalPaid || 0) + Number(data.amount);
    const newStatus =
      newPaid >= Number(invoice.total_amount)
        ? "paid"
        : newPaid > 0
        ? "partially_paid"
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

// تحديث دفعة
export async function updatePayment(id, data) {
  const t = await sequelize.transaction();
  try {
    const payment = await PurchaseInvoicePayment.findByPk(id, { transaction: t });
    if (!payment) throw new Error("Payment not found");

    // ⚠️ (اختياري) تحقق من عدم تجاوز المبلغ الإجمالي للفاتورة
    if (data.amount !== undefined) {
      const invoice = await PurchaseInvoice.findByPk(payment.purchase_invoice_id, {
        transaction: t,
      });
      const totalPaid = await PurchaseInvoicePayment.sum("amount", {
        where: {
          purchase_invoice_id: invoice.id,
          id: { [Op.ne]: id }, // استبعد الدفعة الحالية
        },
        transaction: t,
      });
      const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
      if (Number(data.amount) > remaining) {
        throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
      }
    }

    await payment.update(data, { transaction: t });

    // (اختياري) أعد حساب حالة الفاتورة
    const totalAfter = await PurchaseInvoicePayment.sum("amount", {
      where: { purchase_invoice_id: payment.purchase_invoice_id },
      transaction: t,
    });
    const invoice = await PurchaseInvoice.findByPk(payment.purchase_invoice_id, { transaction: t });
    const newStatus =
      totalAfter >= invoice.total_amount
        ? "paid"
        : totalAfter > 0
        ? "partially_paid"
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

 