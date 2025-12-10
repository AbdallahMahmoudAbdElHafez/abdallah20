
import EntryTypeController from "../controllers/entryTypes.controller.js";
import { Router } from "express";
const router = Router();

router.get("/", EntryTypeController.getAll);
router.post("/", EntryTypeController.create);
router.get("/:id", EntryTypeController.getById);
router.put("/:id", EntryTypeController.update);
router.delete("/:id", EntryTypeController.delete);
export default router;
