import { Op } from "sequelize";
import { PurchaseInvoice, PurchaseInvoicePayment, Party, ExternalJobOrder, ServicePayment } from "../models/index.js";

export async function getSupplierStatement(supplierId, { from, to }) {
  const supplier = await Party.findByPk(supplierId, {
    attributes: ["id", "name", "email", "phone"],
  });
  if (!supplier) throw new Error("Supplier not found");

  // Filter Dates
  const dateFilter = {};
  if (from && to) dateFilter[Op.between] = [from, to];
  else if (from) dateFilter[Op.gte] = from;
  else if (to) dateFilter[Op.lte] = to;

  // Filter for Job Orders
  // ExternalJobOrder has timestamps: false. We must use start_date or end_date.
  // Using start_date for filtering.
  const jobOrderDateFilter = {};
  if (from && to) jobOrderDateFilter[Op.between] = [from, to];
  else if (from) jobOrderDateFilter[Op.gte] = from;
  else if (to) jobOrderDateFilter[Op.lte] = to;


  // 1️⃣ Invoices (Liabilities)
  const invoices = await PurchaseInvoice.findAll({
    where: {
      supplier_id: supplierId,
      ...(Object.keys(dateFilter).length ? { invoice_date: dateFilter } : {}),
    },
    raw: true,
  });

  // 2️⃣ Job Orders (Liabilities - Service & Transport Cost)
  const jobOrders = await ExternalJobOrder.findAll({
    where: {
      party_id: supplierId,
      status: 'completed',
      // Using start_date as the transaction date approximation
      ...(Object.keys(jobOrderDateFilter).length ? { start_date: jobOrderDateFilter } : {}),
    },
    raw: true
  });


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
  const servicePayments = await ServicePayment.findAll({
    where: {
      party_id: supplierId,
      ...(Object.keys(dateFilter).length ? { payment_date: dateFilter } : {}),
    },
    raw: true
  });


  // 5️⃣ Merge Movements
  const movements = [
    // Invoices
    ...invoices.map(inv => ({
      type: "invoice",
      date: inv.invoice_date,
      description: inv.invoice_type === 'opening'
        ? `رصيد افتتاحي (فاتورة #${inv.invoice_number})`
        : `فاتورة مشتريات #${inv.invoice_number}`,
      debit: 0,
      credit: Number(inv.total_amount),
    })),
    // Job Orders (Liability)
    ...jobOrders.map(jo => {
      // Calculate amount owed to supplier (Service + Transport only)
      // Liability = (Service Unit Cost * Produced Qty) + Transport Cost
      const serviceCost = Number(jo.actual_processing_cost_per_unit || 0) * Number(jo.produced_quantity || 0);
      const transportCost = Number(jo.transport_cost || 0);

      const amountOwed = serviceCost + transportCost;

      // Use start_date or end_date, fallback to now if missing (shouldn't happen with filter)
      const dateVal = jo.end_date || jo.start_date || new Date().toISOString().split('T')[0];

      return {
        type: "job_order",
        date: dateVal,
        description: `استحقاق تشغيل خارجي - أمر #${jo.id}`,
        debit: 0,
        credit: amountOwed,
      };
    }).filter(m => m.credit > 0), // Only include if there's a cost

    // Invoice Payments
    ...payments.map(pay => ({
      type: "payment",
      date: pay.payment_date,
      description: `سداد دفعة لفاتورة #${pay["purchase_invoice.invoice_number"]}`,
      debit: Number(pay.amount),
      credit: 0,
    })),

    // Service Payments
    ...servicePayments.map(sp => ({
      type: "service_payment",
      date: sp.payment_date,
      description: sp.note || `سداد دفعة خدمة`,
      debit: Number(sp.amount),
      credit: 0,
    }))

  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 6️⃣ Calculate Running Balance
  let runningBalance = 0;

  // 7️⃣ Opening Balance (Pre-filter)
  let openingBalance = 0;
  if (from) {
    // Previous Invoices
    const prevInvoices = await PurchaseInvoice.sum("total_amount", {
      where: { supplier_id: supplierId, invoice_date: { [Op.lt]: from } },
    });

    // Previous Payments (Invoices)
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

    // Previous Job Orders
    // Need to fetch and sum manually or use sum query carefully
    const prevJobOrders = await ExternalJobOrder.findAll({
      where: {
        party_id: supplierId,
        status: 'completed',
        start_date: { [Op.lt]: from }
      },
      attributes: ['actual_processing_cost_per_unit', 'produced_quantity', 'transport_cost']
    });
    const prevJobOrdersLiability = prevJobOrders.reduce((sum, jo) => {
      const serviceCost = Number(jo.actual_processing_cost_per_unit || 0) * Number(jo.produced_quantity || 0);
      return sum + serviceCost + Number(jo.transport_cost || 0);
    }, 0);

    // Previous Service Payments
    const prevServicePayments = await ServicePayment.sum("amount", {
      where: {
        party_id: supplierId,
        payment_date: { [Op.lt]: from }
      }
    });

    // Net Opening
    // (Invoices + Job Liabilities) - (Inv Payments + Service Payments)
    openingBalance = (prevInvoices || 0) + prevJobOrdersLiability - ((prevPayments || 0) + (prevServicePayments || 0));
  }

  // Apply Opening to first item? No, Statement usually shows Opening then runs.
  // We will pass opening_balance and let UI handle, or inject it?
  // Current logic: returns opening_balance and then maps running balance.
  // We need to initialize runningBalance with openingBalance? usually yes.
  // Code line 60: let runningBalance = 0; 
  // It seems the UI expects 'running_balance' to start from 0 + movement, and then adds opening separately?
  // Or runningBalance SHOULD include Opening?
  // Line 89: const closingBalance = openingBalance + runningBalance; 
  // This implies 'statement' running_balance is just for the period. 
  // But usually running balance in a table includes the previous balance.
  // Let's stick to the existing pattern: Calculate period movements, providing discrete Opening Balance.

  // Wait, if I want the table to show the *True* running balance, I should start `runningBalance` with `openingBalance`.
  // However, I will preserve existing logic:
  // "statement" array has `running_balance` calculated from 0.
  // The frontend likely adds `opening_balance` to it, OR displays it separately.
  // Actually, standard is: row.running = (prev.running || opening) + credit - debit.
  // Let's modify line 60 to start with `openingBalance`? 
  // NO, looking at line 89, it seems `statement` is delta-based, and `closing` sums them.
  // Effectively, the `statement` running balance is "Period Cumulative". 
  // I will KEEP the existing logic to avoid breaking frontend assumptions, 
  // UNLESS the user explicitly said "Statement is wrong". They just said "Add Data".

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
