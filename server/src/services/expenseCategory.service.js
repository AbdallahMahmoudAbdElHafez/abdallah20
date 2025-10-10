// server/src/services/expenseCategory.service.js
import { ExpenseCategory } from "../models/index.js";

class ExpenseCategoryService {
  static async getAll() {
    return await ExpenseCategory.findAll();
  }

  static async getById(id) {
    return await ExpenseCategory.findByPk(id);
  }

  static async create(data) {
    return await ExpenseCategory.create(data);
  }

  static async update(id, data) {
    const category = await ExpenseCategory.findByPk(id);
    if (!category) throw new Error("Category not found");
    return await category.update(data);
  }

  static async delete(id) {
    const category = await ExpenseCategory.findByPk(id);
    if (!category) throw new Error("Category not found");
    return await category.destroy();
  }
}

export default ExpenseCategoryService;
