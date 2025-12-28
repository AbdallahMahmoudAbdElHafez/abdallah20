import { SalesInvoice, SalesInvoiceItem, sequelize, InventoryTransaction, Account, Product, ReferenceType } from "../models/index.js";
import { Op } from "sequelize";
import InventoryTransactionService from './inventoryTransaction.service.js';

export default {
    getAll: async () => {
        return await SalesInvoice.findAll({
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "sales_order" }
            ]
        });
    },

    getById: async (id) => {
        return await SalesInvoice.findByPk(id, {
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "sales_order" },
                { association: "items", include: ["product"] }
            ]
        });
    },

    create: async (data, options = {}) => {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            console.log('Service: Starting invoice creation');
            const { items, ...invoiceData } = data;

            // Auto-generate invoice_number if not provided
            if (!invoiceData.invoice_number) {
                const year = new Date().getFullYear();
                const lastInvoice = await SalesInvoice.findOne({
                    where: {
                        invoice_number: {
                            [Op.like]: `SI-${year}-%`
                        }
                    },
                    order: [['id', 'DESC']]
                });

                let nextNumber = 1;
                if (lastInvoice) {
                    const lastNumber = parseInt(lastInvoice.invoice_number.split('-')[2]);
                    nextNumber = lastNumber + 1;
                }

                invoiceData.invoice_number = `SI-${year}-${String(nextNumber).padStart(6, '0')}`;
            }

            // Check if invoice_type is 'opening' and items exist
            if (invoiceData.invoice_type === 'opening' && items && items.length > 0) {
                throw new Error('لا يمكن إضافة عناصر لفاتورة افتتاحية');
            }

            // Create the invoice
            const invoice = await SalesInvoice.create(invoiceData, { transaction });

            // Create items if they exist
            let createdItems = [];
            let fifoBatchesMap = new Map(); // Store FIFO batches per item for inventory deduction

            if (items && items.length > 0) {
                const itemsWithInvoiceId = items.map(item => ({
                    ...item,
                    sales_invoice_id: invoice.id,
                    warehouse_id: item.warehouse_id || invoice.warehouse_id || null
                }));
                createdItems = await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });

                // Calculate FIFO costs FIRST to determine which batches to use
                const FIFOCostService = (await import('./fifoCost.service.js')).default;
                const itemsForCost = createdItems.map(item => ({
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id || invoice.warehouse_id,
                    quantity: Number(item.quantity) + Number(item.bonus || 0),
                    itemId: item.id // Track which item this is for
                }));

                try {
                    const { itemCosts } = await FIFOCostService.calculateFIFOCostForItems(
                        itemsForCost,
                        transaction
                    );

                    // Store FIFO batches for each item
                    for (const itemCost of itemCosts) {
                        // Find corresponding created item
                        const createdItem = createdItems.find(ci => ci.product_id === itemCost.product_id);
                        if (createdItem) {
                            fifoBatchesMap.set(createdItem.id, itemCost.batches);
                        }
                    }
                } catch (error) {
                    console.error('FIFO batch calculation failed:', error.message);
                    // If FIFO fails, we'll fall back to creating transactions without batch info
                }

                // Create Inventory Transactions (OUT) using FIFO batches
                for (const item of createdItems) {
                    const totalQty = Number(item.quantity) + Number(item.bonus || 0);

                    if (totalQty > 0) {
                        const fifoBatches = fifoBatchesMap.get(item.id);

                        if (fifoBatches && fifoBatches.length > 0) {
                            // Use FIFO batches - create separate transaction for each batch
                            for (const fifoBatch of fifoBatches) {
                                await InventoryTransactionService.create({
                                    product_id: item.product_id,
                                    warehouse_id: item.warehouse_id || invoice.warehouse_id,
                                    transaction_type: 'out',
                                    transaction_date: invoice.invoice_date || new Date(),
                                    note: `Sales Invoice #${invoice.invoice_number || invoice.id}`,
                                    source_type: 'sales_invoice',
                                    source_id: item.id,
                                    batches: [{
                                        batch_id: fifoBatch.batchId,
                                        quantity: fifoBatch.quantity,
                                        cost_per_unit: fifoBatch.costPerUnit
                                    }]
                                }, { transaction });
                            }
                        } else {
                            // Fallback: create transaction without batch (for unbatched items)
                            console.warn(`No FIFO batches found for item ${item.id}, creating unbatched transaction`);
                            await InventoryTransactionService.create({
                                product_id: item.product_id,
                                warehouse_id: item.warehouse_id || invoice.warehouse_id,
                                transaction_type: 'out',
                                transaction_date: invoice.invoice_date || new Date(),
                                note: `Sales Invoice #${invoice.invoice_number || invoice.id}`,
                                source_type: 'sales_invoice',
                                source_id: item.id,
                                batches: [{
                                    batch_id: null,
                                    quantity: totalQty,
                                    cost_per_unit: item.price
                                }]
                            }, { transaction });
                        }
                    }
                }
            }

            // --- Journal Entry Creation (Professional Refactor) ---
            const { createJournalEntry } = await import('./journal.service.js');

            // Use Strict Account IDs as requested
            const SALES_ACCOUNT_ID = 28;
            const CUSTOMER_ACCOUNT_ID = 47;
            const VAT_ACCOUNT_ID = 65;
            const WHT_ACCOUNT_ID = 56;
            const DISCOUNT_ALLOWED_ID = 108;
            const COGS_ACCOUNT_ID = 15;

            // Resolve Inventory Account (49 or fallback to 110)
            let inventoryAccount = await Account.findByPk(49, { transaction });
            if (!inventoryAccount) inventoryAccount = await Account.findByPk(110, { transaction });

            // Determine Collection Account (Debit side)
            // If data.payment_type is 'نقدي', use the provided collection_account_id or a default cash account (e.g. 41)
            let debitAccountId = CUSTOMER_ACCOUNT_ID;
            let debitDescription = `العملاء - فاتورة رقم #${invoice.invoice_number}`;

            if (data.payment_type === 'نقدي' || data.invoice_type_label === 'نقدي') {
                debitAccountId = data.collection_account_id || 41; // Default to 41 if not provided
                debitDescription = `الصندوق/البنك - فاتورة نقدي رقم #${invoice.invoice_number}`;
            }

            console.log('JE Debug: SI Professional Mapping', {
                debitAccount: debitAccountId,
                sales: SALES_ACCOUNT_ID,
                vat: VAT_ACCOUNT_ID,
                wht: WHT_ACCOUNT_ID,
                inventory: inventoryAccount ? inventoryAccount.id : 'MISSING'
            });

            // Ensure ReferenceType exists
            let refType = await ReferenceType.findOne({ where: { code: 'sales_invoice' }, transaction });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'sales_invoice',
                    label: 'فاتورة مبيعات',
                    name: 'فاتورة مبيعات',
                    description: 'Journal Entry for Sales Invoice'
                }, { transaction });
            }

            // 1. Revenue Entry
            const revenueLines = [];

            // Dr Debit Account (Net Total after WHT and Discounts)
            const netReceivable = Number(invoice.total_amount);
            if (netReceivable > 0) {
                revenueLines.push({
                    account_id: debitAccountId,
                    debit: netReceivable,
                    credit: 0,
                    description: debitDescription
                });
            }

            // Dr WHT Asset (Account 56)
            const whtAmount = Number(invoice.tax_amount);
            if (whtAmount > 0) {
                revenueLines.push({
                    account_id: WHT_ACCOUNT_ID,
                    debit: whtAmount,
                    credit: 0,
                    description: `خصم ضرائب (1%) - فاتورة #${invoice.invoice_number}`
                });
            }

            // Note: Cash Discount (108) would go here if provided separately.
            // Currently, additional_discount is treated as Trade Discount (deducted from Sales).

            // Cr Sales Revenue (Account 28) - Deduct Trade Discount
            // As per user: "خصم تجاري أو خصم إضافي (يُخصم من قيمة المبيعات ولا يُقيد بحساب مستقل)"
            const netSales = Number(invoice.subtotal) - Number(invoice.additional_discount);
            if (netSales > 0) {
                revenueLines.push({
                    account_id: SALES_ACCOUNT_ID,
                    debit: 0,
                    credit: netSales,
                    description: `المبيعات (صافي) - فاتورة #${invoice.invoice_number}`
                });
            }

            // Cr VAT (Account 65)
            const vatAmount = Number(invoice.vat_amount);
            if (vatAmount > 0) {
                revenueLines.push({
                    account_id: VAT_ACCOUNT_ID,
                    debit: 0,
                    credit: vatAmount,
                    description: `ضريبة القيمة المضافة - فاتورة #${invoice.invoice_number}`
                });
            }

            if (revenueLines.length > 0) {
                try {
                    await createJournalEntry({
                        refCode: 'sales_invoice',
                        refId: invoice.id,
                        entryDate: invoice.invoice_date,
                        description: `قيد مبيعات - فاتورة #${invoice.invoice_number}`,
                        lines: revenueLines,
                        entryTypeId: 2
                    }, { transaction });
                    console.log('JE Success: SI Professional Revenue Entry Created');
                } catch (err) {
                    console.error('JE Error: SI Professional Revenue Entry Failed', err);
                }
            }

            // 2. Cost Entry (COGS)
            if (inventoryAccount && createdItems.length > 0) {
                // Import FIFO Cost Service
                const FIFOCostService = (await import('./fifoCost.service.js')).default;

                // Prepare items for FIFO cost calculation
                const itemsForCost = createdItems.map(item => ({
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id || invoice.warehouse_id,
                    quantity: Number(item.quantity) + Number(item.bonus || 0)
                }));

                let totalCost = 0;
                try {
                    const { totalCost: fifoCost } = await FIFOCostService.calculateFIFOCostForItems(
                        itemsForCost,
                        transaction
                    );
                    totalCost = fifoCost;
                } catch (error) {
                    console.error('JE Error: COGS FIFO Calculation Failed:', error.message);
                    // Fallback to product cost_price
                    const productIds = createdItems.map(i => i.product_id);
                    const products = await Product.findAll({
                        where: { id: { [Op.in]: productIds } },
                        transaction
                    });
                    const productMap = new Map(products.map(p => [p.id, p]));

                    for (const item of createdItems) {
                        const product = productMap.get(item.product_id);
                        const costPrice = product ? Number(product.cost_price) : 0;
                        if (costPrice > 0) {
                            const qty = Number(item.quantity) + Number(item.bonus || 0);
                            totalCost += qty * costPrice;
                        }
                    }
                }

                if (totalCost > 0) {
                    try {
                        await createJournalEntry({
                            refCode: 'sales_invoice_cost',
                            refId: invoice.id,
                            entryDate: invoice.invoice_date,
                            description: `قيد تكلفة مبيعات - فاتورة #${invoice.invoice_number}`,
                            lines: [
                                {
                                    account_id: COGS_ACCOUNT_ID,
                                    debit: totalCost,
                                    credit: 0,
                                    description: `تكلفة البضاعة المباعة - فاتورة #${invoice.invoice_number}`
                                },
                                {
                                    account_id: inventoryAccount.id,
                                    debit: 0,
                                    credit: totalCost,
                                    description: `المخزون - فاتورة #${invoice.invoice_number}`
                                }
                            ],
                            entryTypeId: 2
                        }, { transaction });
                        console.log('JE Success: SI Professional COGS Entry Created');
                    } catch (err) {
                        console.error('JE Error: SI Professional COGS Entry Failed', err);
                    }
                }
            }

            if (!options.transaction) await transaction.commit();
            console.log('Service: Transaction committed');
            return invoice;
        } catch (error) {
            console.error('Service: Error occurred:', error.message);
            console.error('Service: Error stack:', error.stack);
            if (!options.transaction) await transaction.rollback();
            console.log('Service: Transaction rolled back');
            throw error;
        }
    },

    update: async (id, data) => {
        const transaction = await sequelize.transaction();
        try {
            const { items, ...invoiceData } = data;

            const invoice = await SalesInvoice.findByPk(id, { transaction });
            if (!invoice) {
                await transaction.rollback();
                return null;
            }

            const invoice_type = invoiceData.invoice_type || invoice.invoice_type;
            if (invoice_type === 'opening' && items && items.length > 0) {
                await transaction.rollback();
                throw new Error('لا يمكن إضافة عناصر لفاتورة افتتاحية');
            }

            const oldTransactions = await InventoryTransaction.findAll({
                where: { source_type: 'sales_invoice', source_id: id },
                transaction
            });
            for (const trx of oldTransactions) {
                await InventoryTransactionService.remove(trx.id, { transaction });
            }

            await invoice.update(invoiceData, { transaction });

            if (items !== undefined) {
                await SalesInvoiceItem.destroy({
                    where: { sales_invoice_id: id },
                    transaction
                });

                if (items.length > 0) {
                    const itemsWithInvoiceId = items.map(item => ({
                        ...item,
                        sales_invoice_id: id,
                        warehouse_id: item.warehouse_id || invoice.warehouse_id || null
                    }));
                    const createdItems = await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });

                    // Calculate FIFO costs for the new items
                    const FIFOCostService = (await import('./fifoCost.service.js')).default;
                    const itemsForCost = createdItems.map(item => ({
                        product_id: item.product_id,
                        warehouse_id: item.warehouse_id || invoice.warehouse_id,
                        quantity: Number(item.quantity) + Number(item.bonus || 0)
                    }));

                    let fifoBatchesMap = new Map();
                    try {
                        const { itemCosts } = await FIFOCostService.calculateFIFOCostForItems(itemsForCost, transaction);
                        for (const itemCost of itemCosts) {
                            const createdItem = createdItems.find(ci => ci.product_id === itemCost.product_id);
                            if (createdItem) {
                                fifoBatchesMap.set(createdItem.id, itemCost.batches);
                            }
                        }
                    } catch (error) {
                        console.error('FIFO batch calculation failed in update:', error.message);
                    }

                    // Create inventory transactions using FIFO batches
                    for (const item of createdItems) {
                        const totalQty = Number(item.quantity) + Number(item.bonus || 0);
                        if (totalQty > 0) {
                            const fifoBatches = fifoBatchesMap.get(item.id);

                            if (fifoBatches && fifoBatches.length > 0) {
                                for (const fifoBatch of fifoBatches) {
                                    await InventoryTransactionService.create({
                                        product_id: item.product_id,
                                        warehouse_id: item.warehouse_id || invoice.warehouse_id,
                                        transaction_type: 'out',
                                        transaction_date: invoice.invoice_date,
                                        note: `Sales Invoice #${invoice.invoice_number}`,
                                        source_type: 'sales_invoice',
                                        source_id: item.id,
                                        batches: [{
                                            batch_id: fifoBatch.batchId,
                                            quantity: fifoBatch.quantity,
                                            cost_per_unit: fifoBatch.costPerUnit
                                        }]
                                    }, { transaction });
                                }
                            } else {
                                await InventoryTransactionService.create({
                                    product_id: item.product_id,
                                    warehouse_id: item.warehouse_id || invoice.warehouse_id,
                                    transaction_type: 'out',
                                    transaction_date: invoice.invoice_date,
                                    note: `Sales Invoice #${invoice.invoice_number}`,
                                    source_type: 'sales_invoice',
                                    source_id: item.id,
                                    batches: [{
                                        batch_id: null,
                                        quantity: totalQty,
                                        cost_per_unit: item.price
                                    }]
                                }, { transaction });
                            }
                        }
                    }
                }
            }

            await transaction.commit();
            return invoice;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    delete: async (id) => {
        const row = await SalesInvoice.findByPk(id);
        if (!row) return null;

        const oldTransactions = await InventoryTransaction.findAll({
            where: { source_type: 'sales_invoice', source_id: id }
        });
        for (const trx of oldTransactions) {
            await InventoryTransactionService.remove(trx.id);
        }

        await row.destroy();
        return true;
    }
};
