
import _expressPkg from 'express';
const { Router } = _expressPkg;

const router = Router();

import PurchaseOrderController from "../controllers/purchaseOrder.controller.js";

router.get("/", PurchaseOrderController.getAll);
router.get("/:id", PurchaseOrderController.getById);
router.post("/", PurchaseOrderController.create);
router.put("/:id", PurchaseOrderController.update);
router.delete("/:id", PurchaseOrderController.delete);


export default router;