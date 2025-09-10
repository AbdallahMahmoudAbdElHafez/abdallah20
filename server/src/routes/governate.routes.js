import { Router } from "express";
import GovernateController from "../controllers/governate.controller.js";
const router = Router();

router.get("/", GovernateController.getAll);
router.post("/", GovernateController.create);
router.get("/:id", GovernateController.getById);
router.put("/:id", GovernateController.update);
router.delete("/:id", GovernateController.delete);

export default router;
