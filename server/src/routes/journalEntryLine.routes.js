// routes/journalEntryLineRoutes.js

import { Router } from "express";
import { getJournalEntries, getAll, getById, create, update, deleteById } from "../controllers/journalEntryLine.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/legacy", getJournalEntries); // Keep old endpoint for compatibility
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteById);

export default router;
