// server/src/routes/purchaseInvoices.routes.js

import { Router } from "express";

const router = Router();
import PurchaseInvoiceController from "../controllers/purchaseInvoices.controller.js";
// GET all
router.get("/", PurchaseInvoiceController.getAll);

// GET by id
router.get("/:id", PurchaseInvoiceController.getById);

// POST create
router.post("/", PurchaseInvoiceController.create);

// PUT update
router.put("/:id", PurchaseInvoiceController.update);

// DELETE
router.delete("/:id", PurchaseInvoiceController.delete);

export default router;
