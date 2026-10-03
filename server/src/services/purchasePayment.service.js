import { sequelize, PurchaseInvoicePayment, PurchaseInvoice, Party, Cheque, Account, ReferenceType, Employee } from "../models/index.js";
import { createJournalEntry } from "./journal.service.js";
import { Op } from "sequelize"; // 👈 مهم جداً

export async function createPayment(data) {
  // Sanitize input data
  if (data.employee_id === '') data.employee_id = null;
  if (data.account_id === '') delete data.account_id;

  const t = await sequelize.transaction();
  try {
    // 1️⃣ اجلب الفاتورة مع بيانات المورد
    const invoice = await PurchaseInvoice.findByPk(data.purchase_invoice_id, {
      include: [{ model: Party, as: "supplier" }],
      transaction: t,
    });
    if (!invoice) throw new Error("Invoice not found");

    if (!data.amount || isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
      throw new Error("Invalid payment amount");
    }

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

    // Handle Cheque Creation
    if (data.payment_method === 'cheque' && data.cheque_details) {
      await Cheque.create({
        ...data.cheque_details,
        cheque_type: 'outgoing',
        amount: data.amount,
        purchase_payment_id: payment.id,
        account_id: data.account_id, // The account where the cheque is drawn from (e.g., Notes Payable)
        status: 'issued'
      }, { transaction: t });
    }

    let refType = await ReferenceType.findOne({ where: { code: 'purchase_payment' }, transaction: t });
    if (!refType) {
      refType = await ReferenceType.create({
        code: 'purchase_payment',
        label: 'سداد مشتريات',
        name: 'سداد مشتريات',
        description: 'Journal Entry for Purchase Payment'
      }, { transaction: t });
    }

    await createJournalEntry(
      {
        refCode: "purchase_payment",
        refId: payment.id,
        entryDate: payment.payment_date,
        description: `سداد فاتورة مشتريات #${invoice.invoice_number} - ${data.payment_method}`,
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
            description: `خروج - ${data.payment_method}`,
          },
        ],
        entryTypeId: 6 // PURCHASE_PAYMENT
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
  // Sanitize input data
  if (data.employee_id === '') data.employee_id = null;
  if (data.account_id === '') delete data.account_id;

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

export async function listPayments(invoiceId) {
  return await PurchaseInvoicePayment.findAll({
    where: { purchase_invoice_id: invoiceId },
    include: [
      { model: Account, as: "account" },
      { model: Employee, as: "employee" }
    ],
    order: [["payment_date", "DESC"]],
  });
}

export async function getPaymentById(id) {
  return await PurchaseInvoicePayment.findByPk(id, {
    include: [
      { model: Account, as: "account" },
      { model: Employee, as: "employee" }
    ],
  });
}

export async function deletePayment(id) {
  const t = await sequelize.transaction();
  try {
    const payment = await PurchaseInvoicePayment.findByPk(id, {
      include: [{ model: PurchaseInvoice, as: "purchase_invoice" }],
      transaction: t,
    });
    if (!payment) throw new Error("Payment not found");

    const invoice = payment.purchase_invoice;

    const { JournalEntry, JournalEntryLine, ReferenceType } = await import("../models/index.js");
    const refType = await ReferenceType.findOne({ where: { code: "purchase_payment" }, transaction: t });

    if (refType) {
      const originalEntry = await JournalEntry.findOne({
        where: { reference_type_id: refType.id, reference_id: payment.id },
        include: [{ model: JournalEntryLine, as: "lines" }],
        transaction: t,
      });

      if (originalEntry && originalEntry.lines.length > 0) {
        const reversalLines = originalEntry.lines.map((line) => ({
          account_id: line.account_id,
          debit: line.credit,
          credit: line.debit,
          description: `عكس قيد: ${line.description || ""}`,
        }));

        await createJournalEntry(
          {
            refCode: "manual_entry",
            refId: payment.id,
            entryDate: new Date(),
            description: `إلغاء/عكس سداد فاتورة مشتريات #${invoice?.invoice_number || ""} - السند رقم ${payment.id}`,
            entryTypeId: 5,
            lines: reversalLines,
          },
          { transaction: t }
        );
      }
    }

    await Cheque.destroy({
      where: { purchase_payment_id: payment.id },
      transaction: t,
    });

    await payment.destroy({ transaction: t });

    if (invoice) {
      const totalPaid = await PurchaseInvoicePayment.sum("amount", {
        where: { purchase_invoice_id: invoice.id },
        transaction: t,
      });

      const newPaid = Number(totalPaid || 0);
      const newStatus =
        newPaid >= Number(invoice.total_amount)
          ? "paid"
          : newPaid > 0
            ? "partially_paid"
            : "unpaid";

      await invoice.update({ status: newStatus }, { transaction: t });
    }

    await t.commit();
    return { success: true, message: "Payment deleted successfully" };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
