import { Router } from "express";
import PartyCategoryController from "../controllers/partyCategory.controller.js";
const router = Router();
router.get("/", PartyCategoryController.getAll);
router.post("/", PartyCategoryController.create);
router.get("/:id", PartyCategoryController.getById);
router.put("/:id", PartyCategoryController.update);
router.delete("/:id", PartyCategoryController.delete);
export default router;