// server/src/routes/expense.route.js
import { Router } from "express";
import expenseController from "../controllers/expense.controller.js";

const router = Router();

// GET /api/expenses
router.get("/", expenseController.getAll);

// GET /api/expenses/:id
router.get("/:id", expenseController.getById);

// POST /api/expenses
router.post("/", expenseController.create);

// PUT /api/expenses/:id
router.put("/:id", expenseController.update);

// DELETE /api/expenses/:id
router.delete("/:id", expenseController.delete);

export default router;
