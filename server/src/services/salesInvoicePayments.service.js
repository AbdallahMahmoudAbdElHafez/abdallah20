import { sequelize, SalesInvoicePayment, SalesInvoice, Party, Account, Cheque, ReferenceType } from "../models/index.js";
import { createJournalEntry } from "./journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";
import { Op } from "sequelize";

export async function createPayment(data) {
    // Sanitize input data to handle empty strings for integer columns
    if (data.employee_id === '') data.employee_id = null;
    if (data.account_id === '') delete data.account_id; // Let validation handle missing required fields

    const t = await sequelize.transaction();
    try {
        // 1️⃣ اجلب الفاتورة مع بيانات العميل
        const invoice = await SalesInvoice.findByPk(data.sales_invoice_id, {
            include: [{ model: Party, as: "party" }],
            transaction: t,
        });
        if (!invoice) throw new Error("Invoice not found");

        // 2️⃣ إجمالي المدفوعات السابقة
        const totalPaid = await SalesInvoicePayment.sum("amount", {
            where: { sales_invoice_id: invoice.id },
            transaction: t,
        });

        // 3️⃣ تحقق من المبلغ
        const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
        if (Number(data.amount) > remaining) {
            throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
        }

        // 4️⃣ أنشئ الدفعة
        const payment = await SalesInvoicePayment.create(data, { transaction: t });

        // 5️⃣ قيد اليومية
        if (!invoice.party?.account_id) {
            throw new Error("Customer does not have a linked account_id");
        }

        // Handle Cheque Creation
        if (data.payment_method === 'cheque' && data.cheque_details) {
            await Cheque.create({
                ...data.cheque_details,
                cheque_type: 'incoming',
                amount: data.amount,
                sales_payment_id: payment.id,
                account_id: data.account_id, // The account where the cheque is held (e.g., Notes Receivable)
                status: 'issued'
            }, { transaction: t });
        }

        let refType = await ReferenceType.findOne({ where: { code: 'sales_payment' }, transaction: t });
        if (!refType) {
            refType = await ReferenceType.create({
                code: 'sales_payment',
                label: 'تحصيل مبيعات',
                name: 'تحصيل مبيعات',
                description: 'Journal Entry for Sales Payment/Collection'
            }, { transaction: t });
        }

        await createJournalEntry(
            {
                refCode: "sales_payment",
                refId: payment.id,
                entryDate: payment.payment_date,
                description: `تحصيل فاتورة مبيعات #${invoice.invoice_number} - ${data.payment_method}`,
                entryTypeId: ENTRY_TYPES.SALES_COLLECTION,
                lines: [
                    {
                        account_id: data.account_id, // Cash/Bank/Cheque Account
                        debit: Number(data.amount),
                        credit: 0,
                        description: `تحصيل - ${data.payment_method}`,
                    },
                    {
                        account_id: invoice.party.account_id, // Customer Account
                        debit: 0,
                        credit: Number(data.amount),
                        description: "تخفيض مديونية العميل",
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
                    ? "partial" // Note: SalesInvoice model uses 'partial', PurchaseInvoice used 'partially_paid' in the service code I read, but let's check SalesInvoice model again.
                    : invoice.status;

        // Checking SalesInvoice model status enum: 'unpaid', 'paid', 'partial', 'cancelled'

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

export async function updatePayment(id, data) {
    // Sanitize input data
    if (data.employee_id === '') data.employee_id = null;
    if (data.account_id === '') delete data.account_id;

    const t = await sequelize.transaction();
    try {
        const payment = await SalesInvoicePayment.findByPk(id, { transaction: t });
        if (!payment) throw new Error("Payment not found");

        if (data.amount !== undefined) {
            const invoice = await SalesInvoice.findByPk(payment.sales_invoice_id, {
                transaction: t,
            });
            const totalPaid = await SalesInvoicePayment.sum("amount", {
                where: {
                    sales_invoice_id: invoice.id,
                    id: { [Op.ne]: id },
                },
                transaction: t,
            });
            const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
            if (Number(data.amount) > remaining) {
                throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
            }
        }

        await payment.update(data, { transaction: t });

        // أعد حساب حالة الفاتورة
        const totalAfter = await SalesInvoicePayment.sum("amount", {
            where: { sales_invoice_id: payment.sales_invoice_id },
            transaction: t,
        });
        const invoice = await SalesInvoice.findByPk(payment.sales_invoice_id, { transaction: t });
        const newStatus =
            totalAfter >= invoice.total_amount
                ? "paid"
                : totalAfter > 0
                    ? "partial"
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
    return await SalesInvoicePayment.findAll({
        where: { sales_invoice_id: invoiceId },
        include: [{ model: Account, as: 'account' }]
    });
}

export async function getPaymentById(id) {
    return await SalesInvoicePayment.findByPk(id);
}
