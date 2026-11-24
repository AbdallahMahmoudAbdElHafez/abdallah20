import _expressPkg from 'express';
const { Router } = _expressPkg;
import { createManual, getUnbalancedEntries } from "../controllers/journalEntry.controller.js";

const router = Router();

router.post("/manual", createManual);
router.get("/unbalanced", getUnbalancedEntries);

export default router;
