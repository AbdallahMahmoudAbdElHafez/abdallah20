// src/routes/serviceTypes.routes.js
import { Router } from "express";
import ServiceTypesController from "../controllers/serviceTypes.controller.js";

const router = Router();

router.get("/", ServiceTypesController.getAll);
router.get("/:id", ServiceTypesController.getById);
router.post("/", ServiceTypesController.create);
router.put("/:id", ServiceTypesController.update);
router.delete("/:id", ServiceTypesController.remove);

export default router;
