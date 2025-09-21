import { Op, Sequelize } from "sequelize";
import {
  Party,
  PurchaseInvoice,
  PurchaseInvoicePayment,
  JournalEntry,
  JournalEntryLine,
  Account,
} from "../models/index.js";

/**
 * يعيد كشف حساب مورد
 * @param {number} supplierId  معرف المورد
 * @param {Date} from تاريخ البداية (اختياري)
 * @param {Date} to   تاريخ النهاية (اختياري)
 */
export async function getSupplierStatement(supplierId, { from, to } = {}) {
  // 1️⃣ احضر حساب المورد
  const supplier = await Party.findByPk(supplierId);
  console.log("Supplier:", supplier);   
  if (!supplier) throw new Error("Supplier not found");
  if (!supplier.account_id) throw new Error("Supplier account_id missing");

  const whereDate = {};
  if (from || to) {
    whereDate.entry_date = {};
    if (from) whereDate.entry_date[Op.gte] = from;
    if (to) whereDate.entry_date[Op.lte] = to;
  }

  // 2️⃣ اجمع القيود من دفتر اليومية
  const lines = await JournalEntryLine.findAll({
    where: { account_id: supplier.account_id },
    include: [
      {
        model: JournalEntry,
        as: "journal_entry",
        attributes: ["entry_date", "description", "reference_type_id", "reference_id"],
        where: whereDate,
      },
    ],
    order: [[Sequelize.col("journal_entry.entry_date"), "ASC"]],
  });

  // 3️⃣ صياغة النتيجة وحساب الرصيد
  let balance = 0;
  const statement = lines.map((line) => {
    const debit = Number(line.debit);
    const credit = Number(line.credit);
    balance += debit - credit;

    return {
      date: line.journal_entry.entry_date,
      description: line.journal_entry.description,
      debit,
      credit,
      running_balance: balance,
    };
  });

  return {
    supplier: {
      id: supplier.id,
      name: supplier.name,
    },
    opening_balance: 0, // إن كان لديك رصيد افتتاحي أضفه هنا
    statement,
    closing_balance: balance,
  };
}
