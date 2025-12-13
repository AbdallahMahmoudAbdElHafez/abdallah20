import { createJournalEntry } from "../services/journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";

export default function purchaseReturnsHooks(sequelize) {
    const { Party, Account, ReferenceType } = sequelize.models;
    const PurchaseReturn = sequelize.models.purchase_returns;
    const PurchaseInvoice = sequelize.models.PurchaseInvoice;

    PurchaseReturn.afterCreate(async (purchaseReturn, options) => {
        const t = options.transaction;

        try {
            // 1. Ensure Reference Type exists
            let refType = await ReferenceType.findOne({ where: { code: 'purchase_return' }, transaction: t });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'purchase_return',
                    name: 'مرتجع مشتريات',
                    label: 'مرتجع مشتريات',
                    description: 'قيود مرتجعات المشتريات'
                }, { transaction: t });
            }

            // 2. Get the Purchase Invoice
            const invoice = await PurchaseInvoice.findByPk(purchaseReturn.purchase_invoice_id, { transaction: t });
            if (!invoice) {
                console.warn(`PurchaseReturn Hook: Invoice ${purchaseReturn.purchase_invoice_id} not found. Skipping Journal Entry.`);
                return;
            }

            // 3. Get Supplier Account
            const supplier = await Party.findByPk(invoice.supplier_id, { transaction: t });
            if (!supplier?.account_id) {
                console.warn(`PurchaseReturn Hook: Supplier ${invoice.supplier_id} has no account_id. Skipping Journal Entry.`);
                return;
            }

            // 4. Get Inventory Account
            const inventoryAccount = await Account.findOne({ where: { name: 'المخزون' }, transaction: t });
            if (!inventoryAccount) {
                console.warn(`PurchaseReturn Hook: Inventory Account 'المخزون' not found. Skipping Journal Entry.`);
                return;
            }

            // 5. Calculate return amount (get items total)
            const items = await purchaseReturn.sequelize.models.purchase_return_items.findAll({
                where: { purchase_return_id: purchaseReturn.id },
                transaction: t
            });

            const returnAmount = items.reduce((sum, item) => {
                return sum + (Number(item.quantity) * Number(item.price) - Number(item.discount || 0));
            }, 0);

            if (returnAmount <= 0) {
                console.warn(`PurchaseReturn Hook: Invalid return amount ${returnAmount}. Skipping Journal Entry.`);
                return;
            }

            // 6. Create Journal Entry (Reverse of Purchase Invoice)
            // Debit: Supplier (decrease payable)
            // Credit: Inventory (decrease inventory)
            await createJournalEntry({
                refCode: "purchase_return",
                refId: purchaseReturn.id,
                entryDate: purchaseReturn.return_date || new Date(),
                description: `مرتجع مشتريات لفاتورة #${invoice.invoice_number}`,
                entryTypeId: ENTRY_TYPES.PURCHASE_RETURN,
                lines: [
                    {
                        account_id: supplier.account_id,
                        debit: returnAmount,
                        credit: 0,
                        description: `تخفيض حساب المورد - مرتجع`
                    },
                    {
                        account_id: inventoryAccount.id,
                        debit: 0,
                        credit: returnAmount,
                        description: `تخفيض المخزون - مرتجع مشتريات`
                    }
                ]
            }, { transaction: t });

            console.log(`Journal Entry created for Purchase Return #${purchaseReturn.id}`);

        } catch (error) {
            console.error("Error creating Journal Entry for Purchase Return:", error);
            throw error;
        }
    });
}
