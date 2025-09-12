// server/src/routes/purchaseInvoiceItem.routes.js

import { Router } from "express";
import PurchaseInvoiceItemController from "../controllers/purchaseInvoiceItem.controller.js";
const router = Router();

// CRUD Routes
router.get("/invoice/:invoiceId", PurchaseInvoiceItemController.getAll.bind(PurchaseInvoiceItemController));
router.get("/:id", PurchaseInvoiceItemController.getById.bind(PurchaseInvoiceItemController));
router.post("/", PurchaseInvoiceItemController.create.bind(PurchaseInvoiceItemController));
router.put("/:id", PurchaseInvoiceItemController.update.bind(PurchaseInvoiceItemController));
router.delete("/:id", PurchaseInvoiceItemController.delete.bind(PurchaseInvoiceItemController));

export default router;

