import _expressPkg from 'express';
const { Router } = _expressPkg;
import ProductTypesController from "../controllers/productTypes.controller.js";

const router = Router();

router.get("/", ProductTypesController.getAll);
router.get("/:id", ProductTypesController.getById);
router.post("/", ProductTypesController.create);
router.put("/:id", ProductTypesController.update);
router.delete("/:id", ProductTypesController.delete);

export default router;
