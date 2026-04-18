import { createManualJournalEntry } from "../services/journal.service.js";
import response from "../utils/response.js";
import { sequelize } from "../models/index.js";

export const createManual = async (req, res, next) => {
    try {
        const entry = await createManualJournalEntry(req.body);
        response.ok(res, entry, 201);
    } catch (err) {
        next(err);
    }
};

export const getUnbalancedEntries = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                je.id,
                je.entry_date,
                je.description,
                rt.name as reference_type,
                je.reference_id,
                COALESCE(SUM(jel.debit), 0) as total_debit,
                COALESCE(SUM(jel.credit), 0) as total_credit,
                ABS(COALESCE(SUM(jel.debit), 0) - COALESCE(SUM(jel.credit), 0)) as difference
            FROM journal_entries je
            LEFT JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
            LEFT JOIN reference_types rt ON je.reference_type_id = rt.id
            GROUP BY je.id, je.entry_date, je.description, rt.name, je.reference_id
            HAVING ABS(COALESCE(SUM(jel.debit), 0) - COALESCE(SUM(jel.credit), 0)) > 0.01 OR SUM(jel.debit) IS NULL
            ORDER BY je.entry_date DESC
        `;
        const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        response.ok(res, results);
    } catch (err) {
        next(err);
    }
};
