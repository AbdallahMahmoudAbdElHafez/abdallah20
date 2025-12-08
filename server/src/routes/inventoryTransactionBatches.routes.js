import { Router } from "express";
import InventoryTransactionBatchesController from "../controllers/inventoryTransactionBatches.controller.js";

const router = Router();

router.get("/transaction/:transactionId", InventoryTransactionBatchesController.getByTransactionId);
router.get("/cost/:productId", InventoryTransactionBatchesController.getLatestCost);

export default router;
