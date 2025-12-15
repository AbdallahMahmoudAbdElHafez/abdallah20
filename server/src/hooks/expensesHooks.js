import { createJournalEntry } from "../services/journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";

export default function expensesHooks(sequelize) {
    const { Expense, ReferenceType } = sequelize.models;

    Expense.afterCreate(async (expense, options) => {
        const t = options.transaction;

        try {
            // 1. Ensure Reference Type exists
            let refType = await ReferenceType.findOne({ where: { code: 'expense' }, transaction: t });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'expense',
                    name: 'مصروف',
                    label: 'مصروف',
                    description: 'قيود المصروفات'
                }, { transaction: t });
            }

            // 2. Create Journal Entry
            await createJournalEntry({
                refCode: "expense",
                refId: expense.id,
                entryDate: expense.expense_date || new Date(),
                description: expense.description || `مصروف #${expense.id}`,
                entryTypeId: ENTRY_TYPES.EXPENSE,
                lines: [
                    {
                        account_id: expense.debit_account_id,
                        debit: expense.amount,
                        credit: 0,
                        description: expense.description || `مصروف #${expense.id}`
                    },
                    {
                        account_id: expense.credit_account_id,
                        debit: 0,
                        credit: expense.amount,
                        description: expense.description || `مصروف #${expense.id}`
                    }
                ]
            }, { transaction: t });

            console.log(`Journal Entry created for Expense #${expense.id}`);

        } catch (error) {
            console.error("Error creating Journal Entry for Expense:", error);
            throw error;
        }
    });
}
