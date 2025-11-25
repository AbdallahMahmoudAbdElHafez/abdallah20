import { Router } from "express";
import InventoryTransactionBatchesController from "../controllers/inventoryTransactionBatches.controller.js";

const router = Router();

router.get("/transaction/:transactionId", InventoryTransactionBatchesController.getByTransactionId);

export default router;
