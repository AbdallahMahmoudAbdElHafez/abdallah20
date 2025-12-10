import { JournalEntryLine, JournalEntry, Account, ReferenceType, EntryType } from "../models/index.js";

class JournalEntryLineService {
    static async getAll() {
        return await JournalEntryLine.findAll({
            include: [
                { model: Account, attributes: ["id", "name"] },
                {
                    model: JournalEntry,
                    attributes: ["id", "entry_date", "description", "reference_type_id", "entry_type_id"],
                    include: [
                        { model: ReferenceType, attributes: ["id"] },
                        { model: EntryType, as: 'entry_type', attributes: ["id", "name"] }
                    ],
                    as: 'journal_entry'
                }
            ],
            order: [["id", "DESC"]]
        });
    }

    static async getById(id) {
        return await JournalEntryLine.findByPk(id, {
            include: [
                { model: Account, attributes: ["id", "name"] },
                {
                    model: JournalEntry,
                    attributes: ["id", "entry_date", "description"],
                    include: [ReferenceType, { model: EntryType, as: 'entry_type' }],
                    as: 'journal_entry'
                }
            ]
        });
    }

    static async create(data) {
        return await JournalEntryLine.create(data);
    }

    static async update(id, data) {
        const line = await JournalEntryLine.findByPk(id);
        if (!line) return null;
        return await line.update(data);
    }

    static async delete(id) {
        const line = await JournalEntryLine.findByPk(id);
        if (!line) return null;
        await line.destroy();
        return line;
    }
}

export default JournalEntryLineService;
