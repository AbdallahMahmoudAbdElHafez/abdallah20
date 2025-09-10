import { Router } from "express";
const router = Router();
import PurchaseOrderItemController from "../controllers/purchaseOrderItem.controller.js";


router.get("/order/:orderId", PurchaseOrderItemController.getByOrder);
router.get("/", PurchaseOrderItemController.getAll);
router.post("/", PurchaseOrderItemController.create);
router.get("/:id", PurchaseOrderItemController.getById);
router.put("/:id", PurchaseOrderItemController.update);
router.delete("/:id", PurchaseOrderItemController.delete);
export default router;