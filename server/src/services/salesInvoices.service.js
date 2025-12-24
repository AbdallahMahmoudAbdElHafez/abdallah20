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

            // --- Journal Entry Creation ---
            const { createJournalEntry } = await import('./journal.service.js');

            // Resolve Accounts
            // Hardcoded IDs provided by user as fallbacks or standard IDs
            const VAT_ACCOUNT_ID = 65;
            const SALES_DISCOUNT_ACCOUNT_ID = 108;

            const customerAccount = await Account.findOne({ where: { name: 'العملاء' }, transaction });
            const salesAccount = await Account.findOne({ where: { name: 'مبيعات' }, transaction });

            // VAT: Try specific spelling, standard spelling, then ID
            let vatAccount = await Account.findOne({ where: { name: 'ضريبة القيمه المضافه' }, transaction });
            if (!vatAccount) vatAccount = await Account.findOne({ where: { name: 'ضريبة القيمة المضافة' }, transaction });
            if (!vatAccount) vatAccount = await Account.findByPk(VAT_ACCOUNT_ID, { transaction });

            const cogsAccount = await Account.findOne({ where: { name: 'تكلفة البضاعة المباعة' }, transaction });
            const inventoryAccount = await Account.findOne({ where: { name: 'المخزون' }, transaction });

            // Discount: "خصم مسموح به" (ID 108)
            let discountAccount = await Account.findOne({ where: { name: 'خصم مسموح به' }, transaction });
            if (!discountAccount) discountAccount = await Account.findByPk(SALES_DISCOUNT_ACCOUNT_ID, { transaction });
            if (!discountAccount) discountAccount = await Account.findOne({ where: { name: 'خصم خاص' }, transaction });

            // Tax Discount: "خصم ضرائب مبيعات"
            const whtAccount = await Account.findOne({ where: { name: 'خصم ضرائب مبيعات' }, transaction });

            console.log('JE Debug: SI Accounts Resolved', {
                customer: !!customerAccount ? customerAccount.name : 'MISSING',
                sales: !!salesAccount ? salesAccount.name : 'MISSING',
                vat: !!vatAccount ? (vatAccount.id + '-' + vatAccount.name) : 'MISSING',
                discount: !!discountAccount ? (discountAccount.id + '-' + discountAccount.name) : 'MISSING',
                cogs: !!cogsAccount ? cogsAccount.name : 'MISSING',
                inventory: !!inventoryAccount ? inventoryAccount.name : 'MISSING'
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
            if (customerAccount && salesAccount) {
                const lines = [];

                // Dr Customer (Total Receivable)
                if (Number(invoice.total_amount) > 0) {
                    lines.push({
                        account_id: customerAccount.id,
                        debit: invoice.total_amount,
                        credit: 0,
                        description: `Customer - SI #${invoice.invoice_number}`
                    });
                }

                // Dr Discount
                if (Number(invoice.additional_discount) > 0) {
                    if (discountAccount) {
                        lines.push({
                            account_id: discountAccount.id,
                            debit: invoice.additional_discount,
                            credit: 0,
                            description: `Discount - SI #${invoice.invoice_number}`
                        });
                    } else {
                        console.warn('JE Warning: Discount > 0 but Account MISSING. Entry will be unbalanced!');
                    }
                }

                // Dr WHT Asset (Tax Deducted by Customer)
                if (Number(invoice.tax_amount) > 0) {
                    if (whtAccount) {
                        lines.push({
                            account_id: whtAccount.id,
                            debit: invoice.tax_amount,
                            credit: 0,
                            description: `WHT Asset - SI #${invoice.invoice_number}`
                        });
                    } else {
                        console.warn('JE Warning: TaxAmount > 0 but WHT Account MISSING.');
                    }
                }

                // Cr Sales Revenue (Subtotal)
                if (Number(invoice.subtotal) > 0) {
                    lines.push({
                        account_id: salesAccount.id,
                        debit: 0,
                        credit: invoice.subtotal,
                        description: `Sales Revenue - SI #${invoice.invoice_number}`
                    });
                }

                // Cr VAT
                if (Number(invoice.vat_amount) > 0) {
                    if (vatAccount) {
                        lines.push({
                            account_id: vatAccount.id,
                            debit: 0,
                            credit: invoice.vat_amount,
                            description: `VAT - SI #${invoice.invoice_number}`
                        });
                    } else {
                        console.warn('JE Warning: VAT > 0 but VAT Account MISSING.');
                    }
                }

                if (lines.length > 0) {
                    try {
                        await createJournalEntry({
                            refCode: 'sales_invoice',
                            refId: invoice.id,
                            entryDate: invoice.invoice_date,
                            description: `Sales Invoice #${invoice.invoice_number}`,
                            lines: lines,
                            entryTypeId: 2
                        }, { transaction });
                        console.log('JE Success: SI Revenue Entry Created');
                    } catch (err) {
                        console.error('JE Error: SI Revenue Entry Failed', err);
                    }
                }
            } else {
                console.error('JE Error: SI Revenue Skipped. Missing Essential Accounts (Customer or Sales).', {
                    customer: !!customerAccount ? customerAccount.name : 'MISSING',
                    sales: !!salesAccount ? salesAccount.name : 'MISSING'
                });
            }

            // 2. Cost Entry (COGS)
            if (cogsAccount && inventoryAccount && createdItems.length > 0) {
                // Import FIFO Cost Service
                const FIFOCostService = (await import('./fifoCost.service.js')).default;

                // Prepare items for FIFO cost calculation
                const itemsForCost = createdItems.map(item => ({
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id || invoice.warehouse_id,
                    quantity: Number(item.quantity) + Number(item.bonus || 0)
                }));

                console.log('JE Debug: COGS Calculation Start using FIFO. Items:', createdItems.length);

                let totalCost = 0;
                try {
                    const { totalCost: fifoCost, itemCosts } = await FIFOCostService.calculateFIFOCostForItems(
                        itemsForCost,
                        transaction
                    );
                    totalCost = fifoCost;

                    console.log('JE Debug: FIFO Cost Calculation Success. Total:', totalCost);
                    console.log('JE Debug: Item Costs Details:', JSON.stringify(itemCosts, null, 2));
                } catch (error) {
                    console.error('JE Error: FIFO Cost Calculation Failed:', error.message);
                    // Fallback to product cost_price if FIFO fails
                    console.warn('JE Warning: Falling back to product cost_price due to FIFO error');

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

                console.log('JE Debug: Total COGS Calculated:', totalCost);

                if (totalCost > 0) {
                    // Ensure ref type for Cost
                    let refTypeCost = await ReferenceType.findOne({ where: { code: 'sales_invoice_cost' }, transaction });
                    if (!refTypeCost) {
                        await ReferenceType.create({ code: 'sales_invoice_cost', label: 'تكلفة مبيعات', name: 'تكلفة مبيعات' }, { transaction });
                    }

                    try {
                        await createJournalEntry({
                            refCode: 'sales_invoice_cost',
                            refId: invoice.id,
                            entryDate: invoice.invoice_date,
                            description: `COGS - SI #${invoice.invoice_number}`,
                            lines: [
                                {
                                    account_id: cogsAccount.id,
                                    debit: totalCost,
                                    credit: 0,
                                    description: `COGS - SI #${invoice.invoice_number}`
                                },
                                {
                                    account_id: inventoryAccount.id,
                                    debit: 0,
                                    credit: totalCost,
                                    description: `Inventory - SI #${invoice.invoice_number}`
                                }
                            ],
                            entryTypeId: 2
                        }, { transaction });
                        console.log('JE Success: SI COGS Entry Created');
                    } catch (err) {
                        console.error('JE Error: SI COGS Entry Failed', err);
                    }
                } else {
                    console.warn('JE Warning: COGS Entry Skipped because Total Cost is 0. Check Product Cost Prices.');
                }
            } else {
                if (!cogsAccount || !inventoryAccount) {
                    console.warn('JE Warning: COGS Skipped. Missing COGS or Inventory Account.', {
                        cogs: !!cogsAccount,
                        inventory: !!inventoryAccount
                    });
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
