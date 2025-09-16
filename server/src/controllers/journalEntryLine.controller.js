// controllers/journalController.js
import { JournalEntryLine, JournalEntry, Account, ReferenceType } from "../models/index.js";

export const getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntryLine.findAll({
      include: [
        { model: Account, attributes: ["name"] },
        { model: JournalEntry, attributes: ["entry_date", "description"], include: [ReferenceType] }
      ],
      order: [["id", "ASC"]]
    });
    res.json(entries);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};
