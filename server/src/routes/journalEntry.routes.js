import { Router } from "express";
import { createManual } from "../controllers/journalEntry.controller.js";

const router = Router();

router.post("/manual", createManual);

export default router;
