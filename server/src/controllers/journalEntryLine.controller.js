// controllers/journalEntryLineController.js
import { JournalEntryLine, JournalEntry, Account, ReferenceType, EntryType } from "../models/index.js";
import JournalEntryLineService from "../services/journalEntryLine.service.js";
import response from "../utils/response.js";

export const getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntryLine.findAll({
      include: [
        { model: Account, attributes: ["name"] },
        { model: JournalEntry, attributes: ["entry_date", "description"], include: [ReferenceType, { model: EntryType, as: 'entry_type' }], as: 'journal_entry' }
      ],
      order: [["id", "ASC"]]
    });
    res.json(entries);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

export const getAll = async (req, res, next) => {
  try {
    const lines = await JournalEntryLineService.getAll();
    response.ok(res, lines);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const line = await JournalEntryLineService.getById(req.params.id);
    if (!line) return response.notFound(res, "Journal Entry Line not found");
    response.ok(res, line);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const line = await JournalEntryLineService.create(req.body);
    response.ok(res, line, 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const line = await JournalEntryLineService.update(req.params.id, req.body);
    if (!line) return response.notFound(res, "Journal Entry Line not found");
    response.ok(res, line);
  } catch (err) {
    next(err);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const line = await JournalEntryLineService.delete(req.params.id);
    if (!line) return response.notFound(res, "Journal Entry Line not found");
    response.ok(res, { message: "Journal Entry Line deleted" });
  } catch (err) {
    next(err);
  }
};
