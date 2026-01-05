import express from "express";
import WarehouseInventoryController from "../controllers/warehouseInventory.controller.js";

const router = express.Router();

router.get("/products/:warehouseId", WarehouseInventoryController.getProducts);
router.get("/batches/:warehouseId/:productId", WarehouseInventoryController.getBatches);

export default router;
