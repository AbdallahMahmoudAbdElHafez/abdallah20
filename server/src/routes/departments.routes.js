import express from "express";
import DepartmentController from "../controllers/departments.controller.js";

const router = express.Router();

router.get("/", DepartmentController.getAll);
router.get("/:id", DepartmentController.getById);
router.post("/", DepartmentController.create);
router.put("/:id", DepartmentController.update);
router.delete("/:id", DepartmentController.remove);

export default router;
