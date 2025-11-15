import express from "express";
import employeesController from "../controllers/employees.controller.js";

const router = express.Router();

router.get("/", employeesController.getAll);
router.get("/:id", employeesController.getById);
router.post("/", employeesController.create);
router.put("/:id", employeesController.update);
router.delete("/:id", employeesController.delete);

export default router;
