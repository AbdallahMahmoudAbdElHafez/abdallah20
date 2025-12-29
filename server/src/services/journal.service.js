import { sequelize, JournalEntry, JournalEntryLine, ReferenceType } from "../models/index.js";

export async function createJournalEntry({
  refCode,
  refId,
  entryDate = new Date(),
  description = "",
  lines = [],
  entryTypeId = 1, // Default entry type
}, options = {}) {
  const t = options.transaction || await sequelize.transaction();
  const external = !!options.transaction;
  try {
    const refType = await ReferenceType.findOne({ where: { code: refCode }, transaction: t });
    if (!refType) throw new Error(`Reference type '${refCode}' not found`);

    // منع التكرار
    const existing = await JournalEntry.findOne({
      where: { reference_type_id: refType.id, reference_id: refId },
      transaction: t
    });
    if (existing) {
      if (!external) await t.commit();
      return existing;
    }

    const entry = await JournalEntry.create({
      entry_date: entryDate,
      description,
      reference_type_id: refType.id,
      reference_id: refId,
      entry_type_id: entryTypeId
    }, { transaction: t });

    const linesData = lines.map(l => ({
      journal_entry_id: entry.id,
      account_id: l.account_id,
      debit: l.debit || 0,
      credit: l.credit || 0,
      description: l.description || null
    }));

    await JournalEntryLine.bulkCreate(linesData, { transaction: t });
    if (!external) await t.commit();
    return entry;
  } catch (err) {
    if (!external) await t.rollback();
    throw err;
  }
}

// إنشاء قيد يدوي (Manual Journal Entry)
export async function createManualJournalEntry({
  entryDate = new Date(),
  description = "",
  lines = [],
  entryTypeId = 1,
}, options = {}) {
  const t = options.transaction || await sequelize.transaction();
  const external = !!options.transaction;

  try {
    // Validate that lines balance (total debit = total credit)
    const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error(`Journal entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
    }

    // Find or create "manual_entry" reference type
    let refType = await ReferenceType.findOne({ where: { code: 'manual_entry' }, transaction: t });
    if (!refType) {
      refType = await ReferenceType.create({
        code: 'manual_entry',
        name: 'قيد يدوي',
        label: 'قيد يدوي', // Added required label field
        description: 'قيد يومية يدوي'
      }, { transaction: t });
    }

    const entry = await JournalEntry.create({
      entry_date: entryDate,
      description,
      reference_type_id: refType.id,
      reference_id: null, // No reference for manual entries
      entry_type_id: entryTypeId
    }, { transaction: t });

    const linesData = lines.map(l => ({
      journal_entry_id: entry.id,
      account_id: l.account_id,
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0,
      description: l.description || null
    }));

    await JournalEntryLine.bulkCreate(linesData, { transaction: t });

    if (!external) await t.commit();

    // Return entry with lines
    const result = await JournalEntry.findByPk(entry.id, {
      include: [{ model: JournalEntryLine, as: 'lines' }],
      transaction: external ? t : undefined
    });

    return result;
  } catch (err) {
    if (!external) await t.rollback();
    throw err;
  }
}

/**
 * إنشاء أو تعديل قيد الرصيد الافتتاحي
 * Creates opening balance entry or adjustment entry (for Audit Trail)
 * 
 * @param {Object} params
 * @param {number} params.accountId - رقم الحساب
 * @param {string} params.accountName - اسم الحساب
 * @param {string} params.normalBalance - 'debit' أو 'credit'
 * @param {number} params.newAmount - قيمة الرصيد الافتتاحي الجديد
 * @param {number} params.oldAmount - قيمة الرصيد الافتتاحي السابق (0 للحسابات الجديدة)
 * @param {number} params.contraAccountId - حساب الإقفال (افتراضي: 14 أرباح مرحلة)
 * @param {Object} options - transaction options
 */
export async function createOrAdjustOpeningBalanceEntry({
  accountId,
  accountName,
  normalBalance,
  newAmount,
  oldAmount = 0,
  contraAccountId = 14  // أرباح مرحلة
}, options = {}) {
  const t = options.transaction || await sequelize.transaction();
  const external = !!options.transaction;

  try {
    // حساب الفرق
    const difference = Number(newAmount) - Number(oldAmount);

    // لا حاجة لإنشاء قيد إذا لم يكن هناك فرق
    if (Math.abs(difference) < 0.01) {
      if (!external) await t.commit();
      return null;
    }

    // تحديد نوع القيد: 1 = افتتاحي، 10 = تسوية
    const entryTypeId = oldAmount === 0 ? 1 : 10;
    const description = oldAmount === 0
      ? `قيد الميزان الافتتاحي - ${accountName}`
      : `قيد تسوية رصيد افتتاحي - ${accountName} (من ${oldAmount} إلى ${newAmount})`;

    // إيجاد أو إنشاء reference type
    let refType = await ReferenceType.findOne({
      where: { code: 'opening_balance' },
      transaction: t
    });

    if (!refType) {
      refType = await ReferenceType.create({
        code: 'opening_balance',
        name: 'رصيد افتتاحي',
        label: 'رصيد افتتاحي',
        description: 'قيود الأرصدة الافتتاحية'
      }, { transaction: t });
    }

    // إنشاء القيد
    const entry = await JournalEntry.create({
      entry_date: new Date(),
      description,
      reference_type_id: refType.id,
      reference_id: accountId, // ربط بالحساب
      entry_type_id: entryTypeId
    }, { transaction: t });

    // تحديد خطوط القيد بناءً على الطبيعة والفرق
    const lines = [];
    const absDiff = Math.abs(difference);

    if (normalBalance === 'debit') {
      // حسابات مدينة الطبيعة (أصول)
      if (difference > 0) {
        // زيادة: مدين للحساب، دائن لأرباح مرحلة
        lines.push({ account_id: accountId, debit: absDiff, credit: 0, description: `رصيد افتتاحي - ${accountName}` });
        lines.push({ account_id: contraAccountId, debit: 0, credit: absDiff, description: 'حساب الإقفال' });
      } else {
        // نقص: دائن للحساب، مدين لأرباح مرحلة
        lines.push({ account_id: accountId, debit: 0, credit: absDiff, description: `تعديل رصيد افتتاحي - ${accountName}` });
        lines.push({ account_id: contraAccountId, debit: absDiff, credit: 0, description: 'حساب الإقفال' });
      }
    } else {
      // حسابات دائنة الطبيعة (خصوم، حقوق ملكية)
      if (difference > 0) {
        // زيادة: دائن للحساب، مدين لأرباح مرحلة
        lines.push({ account_id: accountId, debit: 0, credit: absDiff, description: `رصيد افتتاحي - ${accountName}` });
        lines.push({ account_id: contraAccountId, debit: absDiff, credit: 0, description: 'حساب الإقفال' });
      } else {
        // نقص: مدين للحساب، دائن لأرباح مرحلة
        lines.push({ account_id: accountId, debit: absDiff, credit: 0, description: `تعديل رصيد افتتاحي - ${accountName}` });
        lines.push({ account_id: contraAccountId, debit: 0, credit: absDiff, description: 'حساب الإقفال' });
      }
    }

    // إنشاء خطوط القيد
    const linesData = lines.map(l => ({
      journal_entry_id: entry.id,
      account_id: l.account_id,
      debit: l.debit,
      credit: l.credit,
      description: l.description
    }));

    await JournalEntryLine.bulkCreate(linesData, { transaction: t });

    if (!external) await t.commit();

    // إرجاع القيد مع خطوطه
    const result = await JournalEntry.findByPk(entry.id, {
      include: [{ model: JournalEntryLine, as: 'lines' }],
      transaction: external ? t : undefined
    });

    return result;
  } catch (err) {
    if (!external) await t.rollback();
    throw err;
  }
}

/**
 * إنشاء قيد ميزان افتتاحي مجمع لمجموعة من الحسابات
 * Creates a single batch journal entry for multiple accounts' opening balances
 * 
 * @param {Array} accounts - قائمة الحسابات [{id, name, opening_balance, normal_balance}]
 * @param {number} contraAccountId - حساب الإقفال (افتراضي: 14 أرباح مرحلة)
 * @param {Object} options - transaction options
 */
export async function createBatchOpeningBalanceEntry(accounts, contraAccountId = 14, options = {}) {
  const t = options.transaction || await sequelize.transaction();
  const external = !!options.transaction;

  try {
    if (!accounts || accounts.length === 0) {
      if (!external) await t.commit();
      return null;
    }

    // إيجاد أو إنشاء reference type
    let refType = await ReferenceType.findOne({
      where: { code: 'opening_balance' },
      transaction: t
    });

    if (!refType) {
      refType = await ReferenceType.create({
        code: 'opening_balance',
        name: 'رصيد افتتاحي',
        label: 'رصيد افتتاحي',
        description: 'قيود الأرصدة الافتتاحية'
      }, { transaction: t });
    }

    // إنشاء القيد المجمع
    const entry = await JournalEntry.create({
      entry_date: new Date(),
      description: 'قيد الميزان الافتتاحي (مجمع)',
      reference_type_id: refType.id,
      reference_id: null, // قيد مجمع لا يتبع حساب واحد
      entry_type_id: 1 // قيد افتتاحي
    }, { transaction: t });

    const linesData = [];
    let totalDebit = 0;
    let totalCredit = 0;

    for (const acc of accounts) {
      const amount = Number(acc.opening_balance);
      if (amount === 0) continue;

      if (acc.normal_balance === 'debit') {
        linesData.push({
          journal_entry_id: entry.id,
          account_id: acc.id,
          debit: amount,
          credit: 0,
          description: `رصيد افتتاحي - ${acc.name}`
        });
        totalDebit += amount;
      } else {
        linesData.push({
          journal_entry_id: entry.id,
          account_id: acc.id,
          debit: 0,
          credit: amount,
          description: `رصيد افتتاحي - ${acc.name}`
        });
        totalCredit += amount;
      }
    }

    // موازنة القيد مع حساب الإقفال
    const balanceDiff = totalDebit - totalCredit;
    if (Math.abs(balanceDiff) > 0.01) {
      linesData.push({
        journal_entry_id: entry.id,
        account_id: contraAccountId,
        debit: balanceDiff > 0 ? 0 : Math.abs(balanceDiff),
        credit: balanceDiff > 0 ? balanceDiff : 0,
        description: 'حساب الإقفال لموازنة الميزان الافتتاحي'
      });
    }

    await JournalEntryLine.bulkCreate(linesData, { transaction: t });

    if (!external) await t.commit();

    return await JournalEntry.findByPk(entry.id, {
      include: [{ model: JournalEntryLine, as: 'lines' }],
      transaction: external ? t : undefined
    });
  } catch (err) {
    if (!external) await t.rollback();
    throw err;
  }
}
