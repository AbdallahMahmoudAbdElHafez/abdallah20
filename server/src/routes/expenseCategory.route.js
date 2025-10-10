// server/src/routes/expenseCategory.route.js
import { Router } from "express";
import expenseCategoryController from "../controllers/expenseCategory.controller.js";

const router = Router();

// GET /api/expense-categories
router.get("/", expenseCategoryController.getAll);

// GET /api/expense-categories/:id
router.get("/:id", expenseCategoryController.getById);

// POST /api/expense-categories
router.post("/", expenseCategoryController.create);

// PUT /api/expense-categories/:id
router.put("/:id", expenseCategoryController.update);

// DELETE /api/expense-categories/:id
router.delete("/:id", expenseCategoryController.delete);

export default router;
