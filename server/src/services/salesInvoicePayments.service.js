import { sequelize, SalesInvoicePayment, SalesInvoice, Party, Account, Cheque, ReferenceType } from "../models/index.js";
import { createJournalEntry } from "./journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";
import { Op } from "sequelize";

export async function createPayment(data) {
    // Sanitize input data to handle empty strings for integer columns
    if (data.employee_id === '') data.employee_id = null;
    if (data.account_id === '') delete data.account_id; // Let validation handle missing required fields

    // Sanitize decimal fields
    if (data.withholding_tax_rate === '' || data.withholding_tax_rate === null) data.withholding_tax_rate = 0;
    if (data.withholding_tax_amount === '' || data.withholding_tax_amount === null) data.withholding_tax_amount = 0;

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

        // Build journal entry lines with withholding tax support
        const withholdingTaxAmount = Number(data.withholding_tax_amount) || 0;
        const invoiceTotal = Number(data.amount) + withholdingTaxAmount; // المبلغ المحصل + خصم الضريبة = إجمالي المستحق على العميل

        const journalLines = [
            {
                account_id: data.account_id, // Cash/Bank/Cheque Account (مدين الصندوق/البنك)
                debit: Number(data.amount),
                credit: 0,
                description: `تحصيل - ${data.payment_method}`,
            },
        ];

        // Add withholding tax line if applicable (مدين خصم ضرائب)
        if (withholdingTaxAmount > 0) {
            journalLines.push({
                account_id: 56, // Withholding Tax Account
                debit: withholdingTaxAmount,
                credit: 0,
                description: "خصم ضريبة من المنبع",
            });
        }

        // Credit customer account with total (دائن العملاء)
        journalLines.push({
            account_id: 47, // Customer Account
            debit: 0,
            credit: invoiceTotal,
            description: "تخفيض مديونية العميل",
        });

        await createJournalEntry(
            {
                refCode: "sales_payment",
                refId: payment.id,
                entryDate: payment.payment_date,
                description: `تحصيل فاتورة مبيعات #${invoice.invoice_number} - ${data.payment_method}${withholdingTaxAmount > 0 ? ' (مع خصم منبع)' : ''}`,
                entryTypeId: ENTRY_TYPES.SALES_COLLECTION,
                lines: journalLines,
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

    // Sanitize decimal fields
    if (data.withholding_tax_rate === '' || data.withholding_tax_rate === null) data.withholding_tax_rate = 0;
    if (data.withholding_tax_amount === '' || data.withholding_tax_amount === null) data.withholding_tax_amount = 0;

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

export async function deletePayment(id) {
    const t = await sequelize.transaction();
    try {
        // 1️⃣ اجلب السند والبيانات المرتبطة
        const payment = await SalesInvoicePayment.findByPk(id, {
            include: [{ model: SalesInvoice, as: "sales_invoice" }],
            transaction: t
        });
        if (!payment) throw new Error("Payment not found");

        const invoice = payment.sales_invoice;

        // 2️⃣ جلب القيد الأصلي لعمل العكس
        // نستخدم ReferenceType و ReferenceId للوصول للقيد
        const { JournalEntry, JournalEntryLine, ReferenceType } = await import("../models/index.js");
        const refType = await ReferenceType.findOne({ where: { code: 'sales_payment' }, transaction: t });

        if (refType) {
            const originalEntry = await JournalEntry.findOne({
                where: { reference_type_id: refType.id, reference_id: payment.id },
                include: [{ model: JournalEntryLine, as: "lines" }],
                transaction: t
            });

            if (originalEntry && originalEntry.lines.length > 0) {
                // إنشاء قيد عكسي
                const reversalLines = originalEntry.lines.map(line => ({
                    account_id: line.account_id,
                    debit: line.credit,  // عكس: الدائن يصبح مدين
                    credit: line.debit, // عكس: المدين يصبح دائن
                    description: `عكس قيد: ${line.description || ''}`
                }));

                await createJournalEntry({
                    refCode: "manual_entry", // أو "sales_payment_reversal" إذا كان موجوداً
                    refId: payment.id,
                    entryDate: new Date(),
                    description: `إلغاء/عكس تحصيل فاتورة #${invoice.invoice_number} - السند رقم ${payment.id}`,
                    entryTypeId: ENTRY_TYPES.ADJUSTMENT,
                    lines: reversalLines
                }, { transaction: t });
            }
        }

        // 3️⃣ حذف الشيكات المرتبطة إن وجدت
        await Cheque.destroy({
            where: { sales_payment_id: payment.id },
            transaction: t
        });

        // 4️⃣ حذف سجل الدفعة
        await payment.destroy({ transaction: t });

        // 5️⃣ إعادة حساب حالة الفاتورة
        const totalPaid = await SalesInvoicePayment.sum("amount", {
            where: { sales_invoice_id: invoice.id },
            transaction: t,
        });

        const currentPaid = Number(totalPaid || 0);
        const newStatus =
            currentPaid >= Number(invoice.total_amount)
                ? "paid"
                : currentPaid > 0
                    ? "partial"
                    : "unpaid";

        if (newStatus !== invoice.status) {
            await invoice.update({ status: newStatus }, { transaction: t });
        }

        await t.commit();
        return { success: true };
    } catch (err) {
        await t.rollback();
        throw err;
    }
}
