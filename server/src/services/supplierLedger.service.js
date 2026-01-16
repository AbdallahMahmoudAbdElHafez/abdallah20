import { Op } from "sequelize";
import { PurchaseInvoice, PurchaseInvoicePayment, Party, ExternalJobOrder, ServicePayment, PurchaseReturn } from "../models/index.js";

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

  // 1b️⃣ Purchase Returns (Debit Supplier)
  const returns = await PurchaseReturn.findAll({
    where: {
      supplier_id: supplierId,
      ...(Object.keys(dateFilter).length ? { return_date: dateFilter } : {}),
    },
    raw: true
  });

  // 2️⃣ Job Orders (Liabilities - Service & Transport Cost)
  const jobOrders = await ExternalJobOrder.findAll({
    where: {
      party_id: supplierId,
      status: 'completed',
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
      const serviceCost = Number(jo.actual_processing_cost_per_unit || 0) * Number(jo.produced_quantity || 0);
      const transportCost = Number(jo.transport_cost || 0);
      const amountOwed = serviceCost + transportCost;
      const dateVal = jo.end_date || jo.start_date || new Date().toISOString().split('T')[0];

      return {
        type: "job_order",
        date: dateVal,
        description: `استحقاق تشغيل خارجي - أمر #${jo.id}`,
        debit: 0,
        credit: amountOwed,
      };
    }).filter(m => m.credit > 0),

    // Invoice Payments (Debit)
    ...payments.map(pay => ({
      type: "payment",
      date: pay.payment_date,
      description: `سداد دفعة لفاتورة #${pay["purchase_invoice.invoice_number"]}`,
      debit: Number(pay.amount),
      credit: 0,
    })),

    // Service Payments (Debit)
    ...servicePayments.map(sp => ({
      type: "service_payment",
      date: sp.payment_date,
      description: sp.note || `سداد دفعة خدمة`,
      debit: Number(sp.amount),
      credit: 0,
    }))

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

    // If Cash Return: We got money back. 
    // This increases our "Liability/Balance" to the supplier effectively? No.
    // Cash Return: 
    // 1. Return items -> Debit Supplier, Credit Inventory. (Supplier owes us money now / We owe less).
    // 2. We get Cash -> Debit Cash, Credit Supplier. (Supplier pays us, balance settles).
    // So if Cash, we add a paired "Refund" transaction (Credit Supplier).
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

    const prevServicePayments = await ServicePayment.sum("amount", {
      where: {
        party_id: supplierId,
        payment_date: { [Op.lt]: from }
      }
    });

    const prevReturns = await PurchaseReturn.sum("total_amount", {
      where: {
        supplier_id: supplierId,
        return_date: { [Op.lt]: from },
        return_type: 'credit' // Only credit returns affect opening balance
      }
    });

    openingBalance = (prevInvoices || 0) + prevJobOrdersLiability - ((prevPayments || 0) + (prevServicePayments || 0) + (prevReturns || 0));
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
