// routes/journalRoutes.js

import { Router } from "express";
import { getJournalEntries } from "../controllers/journalEntryLine.controller.js";

const router = Router();

router.get("/", getJournalEntries);

export default router;
