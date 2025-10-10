// server/src/controllers/expenseCategory.controller.js
import ExpenseCategoryService from "../services/expenseCategory.service.js";
import response from "../utils/response.js";

class ExpenseCategoryController {
  static async getAll(req, res, next) {
    try {
      const categories = await ExpenseCategoryService.getAll();
      response.ok(res, categories);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const category = await ExpenseCategoryService.getById(req.params.id);
      if (!category) return response.notFound(res, "Category not found");
      response.ok(res, category);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const category = await ExpenseCategoryService.create(req.body);
      response.ok(res, category, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const category = await ExpenseCategoryService.update(req.params.id, req.body);
      if (!category) return response.notFound(res, "Category not found");
      response.ok(res, category);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const category = await ExpenseCategoryService.delete(req.params.id);
      if (!category) return response.notFound(res, "Category not found");
      response.ok(res, { message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default ExpenseCategoryController;
