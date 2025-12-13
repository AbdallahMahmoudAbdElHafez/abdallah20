import { createJournalEntry } from "../services/journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";

export default function salesReturnsHooks(sequelize) {
    const { Party, Account, ReferenceType } = sequelize.models;
    const SalesReturn = sequelize.models.sales_returns;
    const SalesInvoice = sequelize.models.sales_invoices;

    SalesReturn.afterCreate(async (salesReturn, options) => {
        const t = options.transaction;

        try {
            // 1. Ensure Reference Type exists
            let refType = await ReferenceType.findOne({ where: { code: 'sales_return' }, transaction: t });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'sales_return',
                    name: 'مرتجع مبيعات',
                    label: 'مرتجع مبيعات',
                    description: 'قيود مرتجعات المبيعات'
                }, { transaction: t });
            }

            // 2. Get the Sales Invoice
            const invoice = await SalesInvoice.findByPk(salesReturn.sales_invoice_id, { transaction: t });
            if (!invoice) {
                console.warn(`SalesReturn Hook: Invoice ${salesReturn.sales_invoice_id} not found. Skipping Journal Entry.`);
                return;
            }

            // 3. Get Customer Account
            const customer = await Party.findByPk(invoice.party_id, { transaction: t });
            if (!customer?.account_id) {
                console.warn(`SalesReturn Hook: Customer ${invoice.party_id} has no account_id. Skipping Journal Entry.`);
                return;
            }

            // 4. Get Sales Account
            const salesAccount = await Account.findOne({ where: { name: 'المبيعات' }, transaction: t });
            if (!salesAccount) {
                console.warn(`SalesReturn Hook: Sales Account 'المبيعات' not found. Skipping Journal Entry.`);
                return;
            }

            // 5. Calculate return amount (get items total)
            const items = await salesReturn.sequelize.models.sales_return_items.findAll({
                where: { sales_return_id: salesReturn.id },
                transaction: t
            });

            const returnAmount = items.reduce((sum, item) => {
                return sum + (Number(item.quantity) * Number(item.price) - Number(item.discount || 0));
            }, 0);

            if (returnAmount <= 0) {
                console.warn(`SalesReturn Hook: Invalid return amount ${returnAmount}. Skipping Journal Entry.`);
                return;
            }

            // 6. Create Journal Entry (Reverse of Sales Invoice)
            // Debit: Sales (decrease revenue)
            // Credit: Customer (decrease receivable)
            await createJournalEntry({
                refCode: "sales_return",
                refId: salesReturn.id,
                entryDate: salesReturn.return_date || new Date(),
                description: `مرتجع مبيعات لفاتورة #${invoice.invoice_number}`,
                entryTypeId: ENTRY_TYPES.SALES_RETURN,
                lines: [
                    {
                        account_id: salesAccount.id,
                        debit: returnAmount,
                        credit: 0,
                        description: `مرتجع مبيعات - فاتورة #${invoice.invoice_number}`
                    },
                    {
                        account_id: customer.account_id,
                        debit: 0,
                        credit: returnAmount,
                        description: `تخفيض حساب العميل - مرتجع`
                    }
                ]
            }, { transaction: t });

            console.log(`Journal Entry created for Sales Return #${salesReturn.id}`);

        } catch (error) {
            console.error("Error creating Journal Entry for Sales Return:", error);
            throw error;
        }
    });
}
