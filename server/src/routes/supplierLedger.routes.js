import { Router } from "express";
import { getStatement, exportStatement } from "../controllers/supplierLedger.controller.js";

const router = Router();

// GET /api/suppliers/:id/statement?from=2025-01-01&to=2025-12-31
router.get("/:id/statement", getStatement);
router.get("/:id/export", exportStatement);

export default router;
