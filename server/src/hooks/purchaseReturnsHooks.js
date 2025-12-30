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

            // 5. Get return items with product details
            const items = await purchaseReturn.sequelize.models.purchase_return_items.findAll({
                where: { purchase_return_id: purchaseReturn.id },
                include: [{ model: sequelize.models.Product, as: 'product' }],
                transaction: t
            });

            if (items.length === 0) {
                console.warn(`PurchaseReturn Hook: No items found for return ${purchaseReturn.id}. Skipping Journal Entry.`);
                return;
            }

            // Inventory Account IDs by Product Type
            const INVENTORY_ACCOUNTS = {
                FINISHED_GOODS: 110,    // مخزون تام الصنع (منتج تام - type_id: 1)
                RAW_MATERIALS: 111,     // مخزون أولي (مستلزم انتاج - type_id: 2)
                DEFAULT: 49             // المخزون (fallback)
            };

            const PRODUCT_TYPE_TO_ACCOUNT = {
                1: INVENTORY_ACCOUNTS.FINISHED_GOODS,
                2: INVENTORY_ACCOUNTS.RAW_MATERIALS
            };

            // Calculate return amount grouped by product type
            const amountsByType = {};
            let totalReturnAmount = 0;

            for (const item of items) {
                const itemTotal = (Number(item.quantity) * Number(item.price) - Number(item.discount || 0));
                if (itemTotal > 0) {
                    const typeId = item.product?.type_id || null;
                    const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

                    if (!amountsByType[accountId]) {
                        amountsByType[accountId] = 0;
                    }
                    amountsByType[accountId] += itemTotal;
                    totalReturnAmount += itemTotal;
                }
            }

            if (totalReturnAmount <= 0) {
                console.warn(`PurchaseReturn Hook: Invalid return amount ${totalReturnAmount}. Skipping Journal Entry.`);
                return;
            }

            // 6. Create Journal Entry (Reverse of Purchase Invoice)
            // Debit: Supplier (decrease payable)
            // Credit: Inventory accounts by type
            const lines = [
                {
                    account_id: supplier.account_id,
                    debit: totalReturnAmount,
                    credit: 0,
                    description: `تخفيض حساب المورد - مرتجع #${purchaseReturn.id}`
                }
            ];

            // Add credit lines for each inventory account
            for (const [accountId, amount] of Object.entries(amountsByType)) {
                if (amount > 0) {
                    const account = await Account.findByPk(accountId, { transaction: t });
                    lines.push({
                        account_id: parseInt(accountId),
                        debit: 0,
                        credit: amount,
                        description: `تخفيض ${account?.name || 'المخزون'} - مرتجع مشتريات`
                    });
                }
            }

            await createJournalEntry({
                refCode: "purchase_return",
                refId: purchaseReturn.id,
                entryDate: purchaseReturn.return_date || new Date(),
                description: `مرتجع مشتريات لفاتورة #${invoice.invoice_number}`,
                entryTypeId: ENTRY_TYPES.PURCHASE_RETURN,
                lines
            }, { transaction: t });

            console.log(`Journal Entry created for Purchase Return #${purchaseReturn.id}`);

        } catch (error) {
            console.error("Error creating Journal Entry for Purchase Return:", error);
            throw error;
        }
    });
}
