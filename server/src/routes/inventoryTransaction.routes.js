// routes/inventoryTransaction.routes.js
import _expressPkg from 'express';
const { Router } = _expressPkg;
const router = Router();
import InventoryTransactionController from "../controllers/inventoryTransaction.controller.js";

router.get("/", InventoryTransactionController.getAll);
router.get("/:id", InventoryTransactionController.getById);
router.post("/", InventoryTransactionController.create);
router.put("/:id", InventoryTransactionController.update);
router.delete("/:id", InventoryTransactionController.remove);

export default router;
