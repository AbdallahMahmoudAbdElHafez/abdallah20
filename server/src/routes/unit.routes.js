
import UnitController from "../controllers/unit.controller.js";
import _expressPkg from 'express';
const { Router } = _expressPkg;
const router = Router();

router.get("/", UnitController.getAll);
router.post("/", UnitController.create);
router.get("/:id", UnitController.getById);
router.put("/:id", UnitController.update);
router.delete("/:id", UnitController.delete);
export default router;