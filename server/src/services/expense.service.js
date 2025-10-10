// server/src/services/expense.service.js
import { Expense, Account, ExpenseCategory } from "../models/index.js";

class ExpenseService {
  static async getAll() {
    return await Expense.findAll({
      include: [Account, ExpenseCategory],
      order: [["expense_date", "DESC"]],
    });
  }

  static async getById(id) {
    return await Expense.findByPk(id, { include: [Account, ExpenseCategory] });
  }

  static async create(data) {
    return await Expense.create(data);
  }

  static async update(id, data) {
    const expense = await Expense.findByPk(id);
    if (!expense) throw new Error("Expense not found");
    return await expense.update(data);
  }

  static async delete(id) {
    const expense = await Expense.findByPk(id);
    if (!expense) throw new Error("Expense not found");
    return await expense.destroy();
  }
}

export default ExpenseService;
