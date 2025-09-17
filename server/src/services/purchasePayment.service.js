// services/purchasePayment.service.js
import  {
  sequelize,
  PurchaseInvoicePayment,
  PurchaseInvoice,
  Party,
  JournalEntry,
  JournalEntryLine,
  ReferenceType,
  SupplierCheque
} from "../models/index.js";


export async function createPayment(data) {
  // المعاملة تضمن إما إدراج كل شيء أو لا شيء
  const t = await sequelize.transaction();
  try {
    // 1️⃣ إنشاء الدفعة
    const payment = await PurchaseInvoicePayment.create(data, { transaction: t });

    // 2️⃣ احضار حساب المورد من الفاتورة
    const invoice = await PurchaseInvoice.findByPk(data.purchase_invoice_id, {
      include: [{ model: Party, as: "supplier" }],
      transaction: t
    });

    if (!invoice || !invoice.supplier) {
      throw new Error("Supplier or invoice not found");
    }
    const supplierAccountId = invoice.supplier.account_id;
    if (!supplierAccountId) {
      throw new Error("Supplier account_id is missing");
    }

    // 3️⃣ نوع المرجع (يُسهل تتبع القيد)
    const refType = await ReferenceType.findOne({
      where: { code: "purchase_payment" },
      transaction: t
    });

    // 4️⃣ إنشاء قيد اليومية
    const journal = await JournalEntry.create({
      entry_date: data.payment_date,
      description: `Payment for Purchase Invoice #${data.purchase_invoice_id}`,
      reference_type_id: refType?.id ?? null,
      reference_id: payment.id
    }, { transaction: t });

    // 5️⃣ أسطر القيد
    await JournalEntryLine.bulkCreate([
      {
        journal_entry_id: journal.id,
        account_id: supplierAccountId,  // مدين: تقليل التزامات المورد
        debit: data.amount,
        credit: 0,
        description: "Supplier payable cleared"
      },
      {
        journal_entry_id: journal.id,
        account_id: data.account_id,    // دائن: الحساب الذي دفع منه
        debit: 0,
        credit: data.amount,
        description: "Cash/Bank outflow"
      }
    ], { transaction: t });

    await t.commit();
    return payment;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function listPayments(invoiceId) {
  return PurchaseInvoicePayment.findAll({
    where: { purchase_invoice_id: invoiceId },
    include: [{ model: SupplierCheque, as: "cheques" }],
    order: [["payment_date", "DESC"]]
  });
}

export async function getPaymentById(id) {
  return PurchaseInvoicePayment.findByPk(id, {
    include: [{ model: SupplierCheque, as: "cheques" }]
  });
}
