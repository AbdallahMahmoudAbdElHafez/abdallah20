import { createManualJournalEntry } from "../services/journal.service.js";
import response from "../utils/response.js";

export const createManual = async (req, res, next) => {
    try {
        const entry = await createManualJournalEntry(req.body);
        response.ok(res, entry, 201);
    } catch (err) {
        next(err);
    }
};
