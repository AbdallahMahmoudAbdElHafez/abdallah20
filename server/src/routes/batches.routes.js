import _expressPkg from 'express';
const { Router } = _expressPkg;
import BatchesController from "../controllers/batches.controller.js";

const router = Router();

router.get("/", BatchesController.getAll);
router.get("/:id", BatchesController.getById);
router.post("/", BatchesController.create);
router.put("/:id", BatchesController.update);
router.delete("/:id", BatchesController.delete);

export default router;
