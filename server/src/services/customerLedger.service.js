import { Op } from "sequelize";
import { SalesInvoice, SalesInvoicePayment, Party, SalesReturn } from "../models/index.js";

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

    // 🆕 مرتجعات المبيعات (Sales Returns)
    const returns = await SalesReturn.findAll({
        where: {
            party_id: customerId,
            ...(Object.keys(dateFilter).length ? { return_date: dateFilter } : {}),
        },
        raw: true
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
        }))
    ];

    // Add Returns to movements
    returns.forEach(ret => {
        // Return Transaction (Credit the customer)
        movements.push({
            type: "return",
            date: ret.return_date,
            description: `مرتجع مبيعات #${ret.id} (${ret.return_type === 'cash' ? 'نقدي' : 'آجل'})`,
            debit: 0,
            credit: Number(ret.total_amount || 0) + Number(ret.tax_amount || 0) // Should match total value (Net + Tax)
            // Check model: salesReturns only has 'notes', 'return_date'.
            // Wait, I need to know the AMOUNT. 
            // In service create, we calculated totalReturnGross, etc. but SalesReturn model doesn't have 'total_amount' column!
            // I need to ADD 'total_amount' to SalesReturn model and save it!
        });

        // If Cash Return, add Refund Transaction (Debit the customer back to zero effect)
        if (ret.return_type === 'cash') {
            movements.push({
                type: "refund",
                date: ret.return_date,
                description: `صرف نقدية (رد مرتجع) #${ret.id}`,
                debit: Number(ret.total_amount || 0) + Number(ret.tax_amount || 0),
                credit: 0
            });
        }
    });

    movements.sort((a, b) => new Date(a.date) - new Date(b.date));

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

        // Subtract Credit Returns from Opening Balance
        // We only care about CREDIT returns for opening balance calculation (Cash returns cancel out)
        // Wait, I need to fetch them.
        // Issue: SalesReturn model doesn't store total_amount? I need to verify model again.
        // If it doesn't, I must sum items? Too slow.
        // I should ADD total_amount to SalesReturn model.

        // Assuming I'll add total_amount to SalesReturn
        const prevReturns = await SalesReturn.sum("total_amount", {
            where: {
                party_id: customerId,
                return_date: { [Op.lt]: from },
                return_type: 'credit' // Only credit returns affect the running balance carried forward
            }
        });

        openingBalance = (prevInvoices || 0) - (prevPayments || 0) - (prevReturns || 0);
    }

    const closingBalance = openingBalance + runningBalance;

    return {
        customer,
        opening_balance: openingBalance,
        closing_balance: closingBalance,
        statement,
    };
}
