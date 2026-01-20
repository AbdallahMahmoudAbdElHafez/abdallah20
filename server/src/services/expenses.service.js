import { Expense } from "../models/index.js";

export default {
    getAll: async () => {
        return await Expense.findAll({
            include: [
                { association: "debitAccount" },
                { association: "creditAccount" },
                { association: "city" },
                { association: "employee" },
                { association: "party" },
                { association: "doctor" }
            ]
        });
    },

    getById: async (id) => {
        return await Expense.findByPk(id, {
            include: [
                { association: "debitAccount" },
                { association: "creditAccount" },
                { association: "city" },
                { association: "employee" },
                { association: "party" },
                { association: "doctor" }
            ]
        });
    },

    create: async (data) => {
        return await Expense.create(data);
    },

    update: async (id, data) => {
        const row = await Expense.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await Expense.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
