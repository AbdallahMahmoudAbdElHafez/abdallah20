import { Router } from "express";
import CurrentInventoryController from "../controllers/currentInventory.controller.js";

const router = Router();

router.get("/", CurrentInventoryController.getAll);
router.get("/:id", CurrentInventoryController.getById);
router.post("/", CurrentInventoryController.createOrUpdate);
router.put("/:id", CurrentInventoryController.update);
router.delete("/:id", CurrentInventoryController.remove);

export default router;
