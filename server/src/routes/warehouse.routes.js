

import _expressPkg from 'express';
const { Router } = _expressPkg;
import warehouseController from "../controllers/warehouse.controller.js";
const router = Router();

router.get("/", warehouseController.getAll);
router.get("/:id", warehouseController.getById);
router.post("/", warehouseController.create);
router.put("/:id", warehouseController.update);
router.delete("/:id", warehouseController.delete);


export default router;