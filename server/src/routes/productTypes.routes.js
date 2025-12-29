import { Router } from "express";
import ProductTypesController from "../controllers/productTypes.controller.js";

const router = Router();

router.get("/", ProductTypesController.getAll);
router.get("/:id", ProductTypesController.getById);
router.post("/", ProductTypesController.create);
router.put("/:id", ProductTypesController.update);
router.delete("/:id", ProductTypesController.delete);

export default router;
