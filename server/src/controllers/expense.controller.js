// server/src/controllers/expense.controller.js
import ExpenseService from "../services/expense.service.js";
import response from "../utils/response.js";

class ExpenseController {
  static async getAll(req, res, next) {
    try {
      const expenses = await ExpenseService.getAll();
      response.ok(res, expenses);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const expense = await ExpenseService.getById(req.params.id);
      if (!expense) return response.notFound(res, "Expense not found");
      response.ok(res, expense);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const expense = await ExpenseService.create(req.body);
      response.ok(res, expense, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const expense = await ExpenseService.update(req.params.id, req.body);
      response.ok(res, expense);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await ExpenseService.delete(req.params.id);
      response.ok(res, { message: "Expense deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default ExpenseController;
