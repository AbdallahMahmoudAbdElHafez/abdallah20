import { Op } from "sequelize";
import { PurchaseInvoice, PurchaseInvoicePayment, Party, ExternalJobOrder, ServicePayment, PurchaseReturn, Account, ExternalJobOrderService, ExternalServiceInvoice } from "../models/index.js";

export async function getSupplierStatement(supplierId, { from, to }) {
  const supplier = await Party.findByPk(supplierId, {
    attributes: ["id", "name", "email", "phone", "account_id"],
  });
  if (!supplier) throw new Error("Supplier not found");

  // Filter Dates
  const dateFilter = {};
  if (from && to) dateFilter[Op.between] = [from, to];
  else if (from) dateFilter[Op.gte] = from;
  else if (to) dateFilter[Op.lte] = to;

  // 1️⃣ Invoices (Liabilities)
  const invoices = await PurchaseInvoice.findAll({
    where: {
      supplier_id: supplierId,
      ...(Object.keys(dateFilter).length ? { invoice_date: dateFilter } : {}),
    },
    raw: true,
  });

  // 1b️⃣ Purchase Returns (Debit Supplier)
  const returns = await PurchaseReturn.findAll({
    where: {
      supplier_id: supplierId,
      ...(Object.keys(dateFilter).length ? { return_date: dateFilter } : {}),
    },
    raw: true
  });

  // 2️⃣ (REMOVED) Job Orders Implicit Liability
  // Liability is now recorded via ServicePayments (Accrual)

  // 3️⃣ Invoice Payments
  const payments = await PurchaseInvoicePayment.findAll({
    include: [{
      model: PurchaseInvoice,
      as: "purchase_invoice",
      where: { supplier_id: supplierId },
      attributes: ["invoice_number"],
    }],
    where: Object.keys(dateFilter).length
      ? { payment_date: dateFilter }
      : {},
    raw: true,
  });

  // 4️⃣ Service Payments
  // Note: We need 'credit_account_id' to determine if it's Cash or Accrual,
  // and 'account_id' to determine if it's a Settlement (Payment).
  const servicePayments = await ServicePayment.findAll({
    where: {
      party_id: supplierId,
      ...(Object.keys(dateFilter).length ? { payment_date: dateFilter } : {}),
    },
    include: [
      { model: Account, as: 'account', attributes: ['id', 'account_type'] },
      { model: Account, as: 'credit_account', attributes: ['id', 'account_type'] }
    ],
    raw: true,
    nest: true
  });

  // 4b️⃣ Job Order Service Invoices (Legacy Liability Accrual - old system)
  const serviceInvoicesOld = await ExternalJobOrderService.findAll({
    where: {
      party_id: supplierId,
      ...(Object.keys(dateFilter).length ? { service_date: dateFilter } : {}),
    },
    raw: true
  });

  // 4c️⃣ External Service Invoices (New Liability Accrual)
  const serviceInvoicesNew = await ExternalServiceInvoice.findAll({
    where: {
      party_id: supplierId,
      status: 'Posted',
      ...(Object.keys(dateFilter).length ? { invoice_date: dateFilter } : {}),
    },
    raw: true
  });


  // 5️⃣ Merge Movements
  const movements = [
    // ... items ...
    ...invoices.map(inv => ({
      type: "invoice",
      date: inv.invoice_date,
      description: inv.invoice_type === 'opening'
        ? `رصيد افتتاحي (فاتورة #${inv.invoice_number})`
        : `فاتورة مشتريات #${inv.invoice_number}`,
      debit: 0,
      credit: Number(inv.total_amount),
    })),

    // Invoice Payments (Debit)
    ...payments.map(pay => ({
      type: "payment",
      date: pay.payment_date,
      description: `سداد دفعة لفاتورة #${pay["purchase_invoice.invoice_number"]}`,
      debit: Number(pay.amount),
      credit: 0,
    })),

    // Service Invoices (Old System - Credit Supplier)
    ...serviceInvoicesOld.map(si => ({
      type: "service_accrual_old",
      date: si.service_date,
      description: si.note || `خدمات تشغيل (قديم - أمر #${si.job_order_id})`,
      debit: 0,
      credit: Number(si.amount)
    })),

    // External Service Invoices (New System - Credit Supplier)
    ...serviceInvoicesNew.map(si => ({
      type: "service_invoice",
      date: si.invoice_date,
      description: si.notes || `فاتورة خدمات تشغيل #${si.invoice_no || si.id} (أمر #${si.job_order_id})`,
      debit: 0,
      credit: Number(si.total_amount)
    })),

    // Service Payments (Only Settlements now)
    ...servicePayments.map(sp => {
      const debitAccountType = sp.account?.account_type;

      if (debitAccountType === 'liability') {
        // Settlement: Debit Supplier (Liability Decrease / Payment)
        return {
          type: "service_settlement",
          date: sp.payment_date,
          description: sp.note || `سداد مديونية (خدمات)`,
          debit: Number(sp.amount),
          credit: 0
        };
      }
      return null;
    }).filter(Boolean)

  ];

  // Add Purchase Returns
  returns.forEach(ret => {
    // Return: Debit Supplier (We owe less)
    movements.push({
      type: "return",
      date: ret.return_date,
      description: `مردودات مشتريات #${ret.id} (${ret.return_type === 'cash' ? 'نقدي' : 'آجل'})`,
      debit: Number(ret.total_amount),
      credit: 0
    });

    if (ret.return_type === 'cash') {
      movements.push({
        type: "refund",
        date: ret.return_date,
        description: `استلام نقدية (رد مشتريات) #${ret.id}`,
        debit: 0,
        credit: Number(ret.total_amount)
      });
    }
  });

  movements.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 6️⃣ Calculate Running Balance
  let runningBalance = 0;

  // 7️⃣ Opening Balance (Pre-filter)
  let openingBalance = 0;
  if (from) {
    const prevInvoices = await PurchaseInvoice.sum("total_amount", {
      where: { supplier_id: supplierId, invoice_date: { [Op.lt]: from } },
    });

    const prevPayments = await PurchaseInvoicePayment.sum("amount", {
      where: { payment_date: { [Op.lt]: from } },
      include: [{
        model: PurchaseInvoice,
        as: "purchase_invoice",
        required: true,
        where: { supplier_id: supplierId },
        attributes: [],
      }],
    });

    // Service Payments (Accruals & Settlements)
    const prevServicePayments = await ServicePayment.findAll({
      where: {
        party_id: supplierId,
        payment_date: { [Op.lt]: from }
      },
      include: [
        { model: Account, as: 'account', attributes: ['account_type'] },
        { model: Account, as: 'credit_account', attributes: ['account_type'] }
      ]
    });

    const prevServiceTotalMovement = prevServicePayments.reduce((sum, sp) => {
      if (sp.account?.account_type === 'liability') {
        return sum - Number(sp.amount || 0); // Debit (-)
      }
      return sum;
    }, 0);

    const prevServiceInvoicesOld = await ExternalJobOrderService.sum("amount", {
      where: {
        party_id: supplierId,
        service_date: { [Op.lt]: from }
      }
    });

    const prevServiceInvoicesNew = await ExternalServiceInvoice.sum("total_amount", {
      where: {
        party_id: supplierId,
        status: 'Posted',
        invoice_date: { [Op.lt]: from }
      }
    });

    const prevReturns = await PurchaseReturn.sum("total_amount", {
      where: {
        supplier_id: supplierId,
        return_date: { [Op.lt]: from },
        return_type: 'credit' // Only credit returns affect opening balance
      }
    });

    // Formula:
    // + Invoices (Credits)
    // + Service Invoices (Credits)
    // - Service Payments (Debits)
    // - Invoice Payments (Debits)
    // - Returns (Debits)
    openingBalance = (prevInvoices || 0) + (prevServiceInvoicesOld || 0) + (prevServiceInvoicesNew || 0) + prevServiceTotalMovement - ((prevPayments || 0) + (prevReturns || 0));

  }

  const statement = movements.map(row => {
    runningBalance += row.credit - row.debit;
    return { ...row, running_balance: runningBalance };
  });

  const closingBalance = openingBalance + runningBalance;

  return {
    supplier,
    opening_balance: openingBalance,
    closing_balance: closingBalance,
    statement,
  };
}
