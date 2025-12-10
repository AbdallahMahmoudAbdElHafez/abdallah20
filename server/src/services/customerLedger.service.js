import { Op } from "sequelize";
import { SalesInvoice, SalesInvoicePayment, Party } from "../models/index.js";

export async function getCustomerStatement(customerId, { from, to }) {
    const customer = await Party.findByPk(customerId, {
        attributes: ["id", "name", "email", "phone"],
    });
    if (!customer) throw new Error("Customer not found");

    // فلتر التواريخ
    const dateFilter = {};
    if (from && to) dateFilter[Op.between] = [from, to];
    else if (from) dateFilter[Op.gte] = from;
    else if (to) dateFilter[Op.lte] = to;

    // 1️⃣ الفواتير
    const invoices = await SalesInvoice.findAll({
        where: {
            party_id: customerId,
            ...(Object.keys(dateFilter).length ? { invoice_date: dateFilter } : {}),
        },
        raw: true,
    });

    // 2️⃣ المدفوعات
    const payments = await SalesInvoicePayment.findAll({
        include: [{
            model: SalesInvoice,
            as: "sales_invoice",
            where: { party_id: customerId },
            attributes: ["invoice_number"],
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
                ? `رصيد افتتاحي - فاتورة #${inv.invoice_number}`
                : `فاتورة مبيعات #${inv.invoice_number}`,
            debit: Number(inv.total_amount),
            credit: 0,
        })),
        ...payments.map(pay => ({
            type: "payment",
            date: pay.payment_date,
            description: `سداد دفعة لفاتورة #${pay["sales_invoice.invoice_number"]}`,
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
        const prevInvoices = await SalesInvoice.sum("total_amount", {
            where: { party_id: customerId, invoice_date: { [Op.lt]: from } },
        });

        const prevPayments = await SalesInvoicePayment.sum("amount", {
            where: {
                payment_date: { [Op.lt]: from },
            },
            include: [{
                model: SalesInvoice,
                as: "sales_invoice",
                required: true,
                where: { party_id: customerId },
                attributes: [], // ⬅ يمنع إدخال أعمدة إضافية في SELECT
            }],
        });

        openingBalance = (prevInvoices || 0) - (prevPayments || 0);
    }

    const closingBalance = openingBalance + runningBalance;

    return {
        customer,
        opening_balance: openingBalance,
        closing_balance: closingBalance,
        statement,
    };
}
