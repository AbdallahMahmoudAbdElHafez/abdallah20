import { AccountingSetting } from "../models/index.js";

export function listSettings(filter = {}) {
  return AccountingSetting.findAll({ where: filter });
}

export function getSettingById(id) {
  return AccountingSetting.findByPk(id);
}

export function createSetting(data) {
  return AccountingSetting.create(data);
}

export async function updateSetting(id, data) {
  await AccountingSetting.update(data, { where: { id } });
  return getSettingById(id);
}

export function deleteSetting(id) {
  return AccountingSetting.destroy({ where: { id } });
}

/** للبحث عن الإعداد حسب نوع العملية (ومجال اختياري) */
export function findByOperation(operation_type, scope = null) {
  return AccountingSetting.findOne({ where: { operation_type, scope } });
}
export async function createPayment(data) {
  return sequelize.transaction(async (t) => {
    // أنشئ سجل الدفع
    const payment = await PurchaseInvoicePayment.create(data, { transaction: t });

    // احضر الإعداد المناسب لطريقة الدفع
    const op = data.payment_method === "cash" ? "payment_cash" : "payment_bank";
    const setting = await findByOperation(op);

    // قم بإنشاء القيد المحاسبي
    const invoice = await PurchaseInvoice.findByPk(data.purchase_invoice_id, { transaction: t });
    const entry = await JournalEntry.create({
      entry_date: new Date(),
      description: `Payment ${payment.id} for invoice ${invoice.id}`,
      reference_type_id: 1,
      reference_id: payment.id
    }, { transaction: t });

    await JournalEntryLine.bulkCreate([
      {
        journal_entry_id: entry.id,
        account_id: invoice.supplier_account_id || invoice.supplier.account_id,
        debit: data.amount,
        credit: 0
      },
      {
        journal_entry_id: entry.id,
        account_id: data.account_id, // الحساب الفرعي الذي يختاره المستخدم (Cash/Bank)
        debit: 0,
        credit: data.amount
      }
    ], { transaction: t });

    return payment;
  });
}