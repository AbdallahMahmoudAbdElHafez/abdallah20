import { Expense, sequelize } from "../models/index.js";
import { createReverseJournalEntry } from "./journal.service.js";

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
        const t = await sequelize.transaction();
        try {
            const row = await Expense.findByPk(id, { transaction: t });
            if (!row) {
                await t.rollback();
                return null;
            }

            // إنشاء قيد عكسي قبل الحذف
            await createReverseJournalEntry({
                originalRefCode: 'expense',
                originalRefId: row.id,
                newRefCode: 'expense_delete',
                newRefId: row.id,
                newDescription: `عكس قيد مصروف #${row.id} - ${row.description || ''}`,
                entryDate: new Date(),
            }, { transaction: t });

            await row.destroy({ transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
};
