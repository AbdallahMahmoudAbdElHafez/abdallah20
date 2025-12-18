import { SalesReturn, SalesReturnItem, sequelize, InventoryTransaction, Account, Product, ReferenceType, SalesInvoice } from "../models/index.js";
import { Op } from "sequelize";
// Dynamically import to avoid circular dependency issues if any, though static import is usually fine here
import InventoryTransactionService from './inventoryTransaction.service.js';

export default {
    getAll: async () => {
        return await SalesReturn.findAll({
            include: [
                { association: "invoice" },
                { association: "warehouse" },
                { association: "items", include: ["product"] }
            ]
        });
    },

    getById: async (id) => {
        return await SalesReturn.findByPk(id, {
            include: [
                { association: "invoice" },
                { association: "warehouse" },
                { association: "items", include: ["product"] }
            ]
        });
    },

    create: async (data, options = {}) => {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            console.log('Service: Starting Sales Return creation', data);
            const { items, ...returnData } = data;

            // 1. Create Sales Return Record
            const salesReturn = await SalesReturn.create(returnData, { transaction });

            // 2. Create Items & Inventory Transactions
            let createdItems = [];
            let totalCost = 0; // For COGS Reversal

            if (items && items.length > 0) {
                const itemsWithReturnId = items.map(item => ({
                    ...item,
                    sales_return_id: salesReturn.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }));

                createdItems = await SalesReturnItem.bulkCreate(itemsWithReturnId, { transaction });

                // Fetch products to get cost price for COGS calculation
                const productIds = items.map(i => i.product_id);
                const products = await Product.findAll({
                    where: { id: { [Op.in]: productIds } },
                    transaction
                });
                const productMap = new Map(products.map(p => [p.id, p]));

                // Create Inventory Transactions (IN - Return to Stock)
                for (const item of createdItems) {
                    const product = productMap.get(item.product_id);
                    const costPrice = product ? Number(product.cost_price) : 0;

                    if (Number(item.quantity) > 0) {
                        // accumulate cost for JE
                        totalCost += Number(item.quantity) * costPrice;

                        // Create Inventory In Transaction
                        // Note: Sales Return usually doesn't have batch info in basic payload unless provided.
                        // We assume generic return or handle batches if provided.
                        const batches = item.batch_number && item.expiry_date ?
                            [{ batch_number: item.batch_number, expiry_date: item.expiry_date, quantity: item.quantity, cost_per_unit: costPrice }] :
                            [{ batch_number: null, expiry_date: null, quantity: item.quantity, cost_per_unit: costPrice }];

                        await InventoryTransactionService.create({
                            product_id: item.product_id,
                            warehouse_id: salesReturn.warehouse_id,
                            transaction_type: 'in', // Returning to stock
                            transaction_date: salesReturn.return_date || new Date(),
                            note: `Sales Return #${salesReturn.id} for Invoice #${salesReturn.sales_invoice_id}`,
                            source_type: 'sales_return',
                            source_id: item.id,
                            batches: batches
                        }, { transaction });
                    }
                }
            }

            // --- Journal Entry Creation ---
            const { createJournalEntry } = await import('./journal.service.js');

            // Resolve Accounts
            const VAT_ACCOUNT_ID = 65;
            const SALES_DISCOUNT_ACCOUNT_ID = 108;

            const customerAccount = await Account.findOne({ where: { name: 'العملاء' }, transaction });
            const salesAccount = await Account.findOne({ where: { name: 'مبيعات' }, transaction }); // Or "مردودات المبيعات" if exists? Usually straight reversal or specific return account.
            const salesReturnAccount = await Account.findOne({ where: { name: 'مردودات المبيعات' }, transaction }); // Prefer this if exists

            // VAT Lookups
            let vatAccount = await Account.findOne({ where: { name: 'ضريبة القيمه المضافه' }, transaction });
            if (!vatAccount) vatAccount = await Account.findOne({ where: { name: 'ضريبة القيمة المضافة' }, transaction });
            if (!vatAccount) vatAccount = await Account.findByPk(VAT_ACCOUNT_ID, { transaction });

            const cogsAccount = await Account.findOne({ where: { name: 'تكلفة البضاعة المباعة' }, transaction });
            const inventoryAccount = await Account.findOne({ where: { name: 'المخزون' }, transaction });

            // Discount Lookups
            let discountAccount = await Account.findOne({ where: { name: 'خصم مسموح به' }, transaction });
            if (!discountAccount) discountAccount = await Account.findByPk(SALES_DISCOUNT_ACCOUNT_ID, { transaction });

            // Tax Discount Lookups
            const whtAccount = await Account.findOne({ where: { name: 'خصم ضرائب مبيعات' }, transaction });

            // Identify Accounts to use
            // If "مردودات المبيعات" exists, use it. Else debit "مبيعات".
            const revenueAccountToDebit = salesReturnAccount || salesAccount;

            console.log('JE Debug: Sales Return Accounts Resolved', {
                customer: !!customerAccount,
                revenueDebit: !!revenueAccountToDebit ? revenueAccountToDebit.name : 'MISSING',
                vat: !!vatAccount,
                cogs: !!cogsAccount,
                inventory: !!inventoryAccount
            });

            // Ensure ReferenceType exists
            let refType = await ReferenceType.findOne({ where: { code: 'sales_return' }, transaction });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'sales_return',
                    label: 'مرتجع مبيعات',
                    name: 'مرتجع مبيعات',
                    description: 'Journal Entry for Sales Return'
                }, { transaction });
            }

            // Use data passed from frontend, as model might not have them
            // Fallback: Calculate from items if not in data (though VAT logic might be complex)
            const totalAmount = Number(data.total_amount || 0);
            const subtotal = Number(data.subtotal || 0); // Ex: Revenue amount
            const vatAmount = Number(data.vat_amount || 0);
            const taxAmount = Number(data.tax_amount || 0);
            const discountAmount = Number(data.additional_discount || 0); // This was DEBITED in Invoice, so CREDIT here to reverse? 
            // Warning: Reversing discount is tricky. If we return full invoice, we reverse everything.

            // 1. Revenue Reversal Entry
            // Normal Invoice: Dr Customer, Cr Sales, Cr VAT.
            // Return: Dr Sales (or Returns), Dr VAT, Cr Customer.
            if (customerAccount && revenueAccountToDebit) {
                const lines = [];

                // Dr Sales Return / Sales
                if (subtotal > 0) {
                    lines.push({
                        account_id: revenueAccountToDebit.id,
                        debit: subtotal,
                        credit: 0,
                        description: `Sales Return - Ref #${salesReturn.id}`
                    });
                }

                // Dr VAT
                if (vatAmount > 0 && vatAccount) {
                    lines.push({
                        account_id: vatAccount.id,
                        debit: vatAmount,
                        credit: 0,
                        description: `VAT Reversal - Ref #${salesReturn.id}`
                    });
                }

                // Cr Discount (Reversal) - If we gave discount, we take it back? 
                // Invoice: Dr Discount. Return: Cr Discount (Revenue increase technically, or expense reduction).
                if (discountAmount > 0 && discountAccount) {
                    lines.push({
                        account_id: discountAccount.id,
                        debit: 0,
                        credit: discountAmount,
                        description: `Discount Reversal - Ref #${salesReturn.id}`
                    });
                }

                // Cr WHT Asset (Reversal) - Invoice: Dr WHT. Return: Cr WHT.
                if (taxAmount > 0 && whtAccount) {
                    lines.push({
                        account_id: whtAccount.id,
                        debit: 0,
                        credit: taxAmount,
                        description: `WHT Reversal - Ref #${salesReturn.id}`
                    });
                }

                // Cr Customer (Total Refundable)
                if (totalAmount > 0) {
                    lines.push({
                        account_id: customerAccount.id,
                        debit: 0,
                        credit: totalAmount,
                        description: `Customer Refund - Ref #${salesReturn.id}`
                    });
                }

                if (lines.length > 0) {
                    await createJournalEntry({
                        refCode: 'sales_return',
                        refId: salesReturn.id,
                        entryDate: salesReturn.return_date,
                        description: `Sales Return #${salesReturn.id} (Inv #${salesReturn.sales_invoice_id})`,
                        lines: lines,
                        entryTypeId: 4 // entry_type 4 is 'قيد مرتجع مبيعات'
                    }, { transaction });
                }
            }

            // 2. COGS Reversal Entry
            // Invoice: Dr COGS, Cr Inventory.
            // Return: Dr Inventory, Cr COGS.
            if (totalCost > 0 && cogsAccount && inventoryAccount) {
                // Ensure ref Code exists if we want separate one, or reuse sales_return
                // Reuse sales_return for simplicity or create sales_return_cost

                await createJournalEntry({
                    refCode: 'sales_return',
                    refId: salesReturn.id,
                    entryDate: salesReturn.return_date,
                    description: `COGS Reversal - Sales Return #${salesReturn.id}`,
                    lines: [
                        {
                            account_id: inventoryAccount.id,
                            debit: totalCost,
                            credit: 0,
                            description: `Inventory Restock - Return #${salesReturn.id}`
                        },
                        {
                            account_id: cogsAccount.id,
                            debit: 0,
                            credit: totalCost,
                            description: `COGS Reversal - Return #${salesReturn.id}`
                        }
                    ],
                    entryTypeId: 4
                }, { transaction });
            }

            if (!options.transaction) await transaction.commit();
            return salesReturn;
        } catch (error) {
            console.error('Service: Sales Return Creation Error', error);
            if (!options.transaction) await transaction.rollback();
            throw error;
        }
    },

    update: async (id, data) => {
        // Implement full update logic if needed (delete old trx/JE, recreate)
        const row = await SalesReturn.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        // Implement full delete logic (reverse inventory, delete JE)
        const row = await SalesReturn.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
