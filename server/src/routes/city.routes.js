import { Router } from "express";
import cityController from "../controllers/city.controller.js";
const router = Router();

router.get("/", cityController.getAll);
router.get("/:id", cityController.getById);
router.post("/", cityController.create);
router.put("/:id", cityController.update);
router.delete("/:id", cityController.delete);

export default router;
