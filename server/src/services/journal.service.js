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
