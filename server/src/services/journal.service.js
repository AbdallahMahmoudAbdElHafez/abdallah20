import { sequelize, JournalEntry, JournalEntryLine, ReferenceType } from "../models/index.js";

export async function createJournalEntry({
  refCode,
  refId,
  entryDate = new Date(),
  description = "",
  lines = [],
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
      reference_id: refId
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
