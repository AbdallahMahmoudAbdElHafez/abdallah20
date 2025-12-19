import express from "express";
import BatchInventoryController from "../controllers/batchInventory.controller.js";

const router = express.Router();

// Read-only routes (batch inventory is managed automatically)
router.get("/", BatchInventoryController.getAll);
router.get("/batch/:batchId", BatchInventoryController.getByBatch);
router.get("/warehouse/:warehouseId", BatchInventoryController.getByWarehouse);

export default router;
