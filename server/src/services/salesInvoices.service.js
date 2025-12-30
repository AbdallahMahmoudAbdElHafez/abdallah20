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

            // 2. Cost Entry (COGS)
            if (createdItems.length > 0) {
                // Import FIFO Cost Service
                const FIFOCostService = (await import('./fifoCost.service.js')).default;

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

                // Prepare items for FIFO cost calculation
                const itemsForCost = createdItems.map(item => ({
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id || invoice.warehouse_id,
                    quantity: Number(item.quantity) + Number(item.bonus || 0)
                }));

                // Get products with type_id
                const productIds = createdItems.map(i => i.product_id);
                const products = await Product.findAll({
                    where: { id: { [Op.in]: productIds } },
                    transaction
                });
                const productMap = new Map(products.map(p => [p.id, p]));

                let costsByType = {};
                let totalCost = 0;

                try {
                    const { totalCost: fifoCost, itemCosts } = await FIFOCostService.calculateFIFOCostForItems(
                        itemsForCost,
                        transaction
                    );
                    totalCost = fifoCost;

                    // Group costs by product type
                    for (const itemCost of itemCosts) {
                        const product = productMap.get(itemCost.product_id);
                        const typeId = product?.type_id || null;
                        const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

                        if (!costsByType[accountId]) {
                            costsByType[accountId] = 0;
                        }
                        costsByType[accountId] += itemCost.totalCost;
                    }
                } catch (error) {
                    console.error('JE Error: COGS FIFO Calculation Failed:', error.message);
                    // Fallback to product cost_price
                    for (const item of createdItems) {
                        const product = productMap.get(item.product_id);
                        const costPrice = product ? Number(product.cost_price) : 0;
                        if (costPrice > 0) {
                            const qty = Number(item.quantity) + Number(item.bonus || 0);
                            const itemCost = qty * costPrice;
                            totalCost += itemCost;

                            const typeId = product?.type_id || null;
                            const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

                            if (!costsByType[accountId]) {
                                costsByType[accountId] = 0;
                            }
                            costsByType[accountId] += itemCost;
                        }
                    }
                }

                if (totalCost > 0) {
                    try {
                        const lines = [
                            {
                                account_id: COGS_ACCOUNT_ID,
                                debit: totalCost,
                                credit: 0,
                                description: `تكلفة البضاعة المباعة - فاتورة #${invoice.invoice_number}`
                            }
                        ];

                        // Add credit lines for each inventory account
                        for (const [accountId, amount] of Object.entries(costsByType)) {
                            if (amount > 0) {
                                const account = await Account.findByPk(accountId, { transaction });
                                lines.push({
                                    account_id: parseInt(accountId),
                                    debit: 0,
                                    credit: amount,
                                    description: `${account?.name || 'المخزون'} - فاتورة #${invoice.invoice_number}`
                                });
                            }
                        }

                        await createJournalEntry({
                            refCode: 'sales_invoice_cost',
                            refId: invoice.id,
                            entryDate: invoice.invoice_date,
                            description: `قيد تكلفة مبيعات - فاتورة #${invoice.invoice_number}`,
                            lines,
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
