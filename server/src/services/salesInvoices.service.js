import { SalesInvoice, SalesInvoiceItem, sequelize, InventoryTransaction, Account, Product, ReferenceType } from "../models/index.js";
import { Op } from "sequelize";
import InventoryTransactionService from './inventoryTransaction.service.js';

export default {
    getAll: async (params = {}) => {
        const { month, year } = params;
        const whereClause = {};

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            whereClause.invoice_date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            whereClause.invoice_date = {
                [Op.between]: [startDate, endDate]
            };
        }

        return await SalesInvoice.findAll({
            where: whereClause,
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "distributor_employee" },
                { association: "sales_order" },
                { association: "account" }
            ],
            order: [['invoice_date', 'DESC'], ['id', 'DESC']]
        });
    },

    getById: async (id) => {
        return await SalesInvoice.findByPk(id, {
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "distributor_employee" },
                { association: "sales_order" },
                { association: "account" },
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

            // Calculate total items VAT if items exist
            if (items && items.length > 0) {
                invoiceData.vat_amount = items.reduce((sum, item) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 0;
                    const disc = Number(item.discount) || 0;
                    const vatRate = Number(item.vat_rate) || 0;
                    const itemVat = (qty * price - disc) * (vatRate / 100);
                    item.vat_amount = itemVat; // Ensure item has vat_amount
                    return sum + itemVat;
                }, 0);
            }

            // Create the invoice
            const invoice = await SalesInvoice.create(invoiceData, { transaction });

            // Only create inventory transactions and journal entries if status is 'approved'
            if (invoice.invoice_status === 'approved') {
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

                // --- Journal Entry Creation (Strict Professional Implementation) ---
                const { createJournalEntry } = await import('./journal.service.js');

                // Strict Account IDs
                const SALES_ACCOUNT_ID = 28;
                const CUSTOMER_ACCOUNT_ID = 47;
                const VAT_ACCOUNT_ID = 65;
                const TAX_ACCOUNT_ID = 66; // مصلحة الضرائب
                const DISCOUNT_ALLOWED_ID = 108;
                const COGS_ACCOUNT_ID = 15;
                const OPENING_BALANCE_OFFSET_ID = 117; // الارصدة الافتتاحية(Equity/Balance Sheet Offset)

                // Calculations derived from invoice details
                const subtotal = Number(invoice.subtotal) || 0;
                const shippingAmount = Number(invoice.shipping_amount) || 0;
                const vatAmount = Number(invoice.vat_amount) || 0;
                const taxAmount = Number(invoice.tax_amount) || 0;
                const discount = Number(invoice.additional_discount) || 0;
                const finalTotal = Number(invoice.total_amount) || 0;

                if (invoice.invoice_type === 'opening') {
                    // --- JE 1 (Opening): Balance Forward ---
                    await createJournalEntry({
                        refCode: 'sales_invoice_opening',
                        refId: invoice.id,
                        entryDate: invoice.invoice_date,
                        description: `رصيد أول المدة - فاتورة #${invoice.invoice_number}`,
                        lines: [
                            {
                                account_id: CUSTOMER_ACCOUNT_ID,
                                debit: finalTotal,
                                credit: 0,
                                description: `إثبات رصيد افتتاحى للعميل - فاتورة #${invoice.invoice_number}`
                            },
                            {
                                account_id: OPENING_BALANCE_OFFSET_ID,
                                debit: 0,
                                credit: finalTotal,
                                description: `مقابل رصيد افتتاحى - فاتورة #${invoice.invoice_number}`
                            }
                        ],
                        entryTypeId: 1 // قيد افتتاحي
                    }, { transaction });

                    console.log('JE Success: SI Opening Balance Entry Created');
                } else {
                    // --- Regular Sales Invoice Flow ---

                    // --- JE 1: Revenue & VAT ---
                    const je1Lines = [];

                    // 1. Credit Sales Revenue (Gross Subtotal)
                    je1Lines.push({
                        account_id: SALES_ACCOUNT_ID,
                        debit: 0,
                        credit: subtotal,
                        description: `إيراد مبيعات - فاتورة #${invoice.invoice_number}`
                    });

                    // 1.1 Credit Shipping Revenue (if applicable)
                    if (shippingAmount > 0) {
                        je1Lines.push({
                            account_id: 115, // إيراد شحن
                            debit: 0,
                            credit: shippingAmount,
                            description: `إيراد شحن - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    // 2. Credit VAT (Liability)
                    if (vatAmount > 0) {
                        je1Lines.push({
                            account_id: VAT_ACCOUNT_ID,
                            debit: 0,
                            credit: vatAmount,
                            description: `ضريبة القيمة المضافة - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    // 3. Credit Other Taxes (Liability)
                    if (taxAmount > 0) {
                        je1Lines.push({
                            account_id: TAX_ACCOUNT_ID,
                            debit: 0,
                            credit: taxAmount,
                            description: `ضرائب أخرى - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    // 4. Debit Discount Allowed (Contra-Revenue/Expense)
                    if (discount > 0) {
                        je1Lines.push({
                            account_id: DISCOUNT_ALLOWED_ID,
                            debit: discount,
                            credit: 0,
                            description: `خصم مسموح به - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    // 5. Debit Account (Cash/Bank or Accounts Receivable)
                    je1Lines.push({
                        account_id: invoice.account_id || CUSTOMER_ACCOUNT_ID,
                        debit: finalTotal,
                        credit: 0,
                        description: invoice.account_id ? `متحصلات مبيعات - فاتورة #${invoice.invoice_number}` : `مديونية عميل - فاتورة #${invoice.invoice_number}`
                    });

                    await createJournalEntry({
                        refCode: 'sales_invoice',
                        refId: invoice.id,
                        entryDate: invoice.invoice_date,
                        description: `قيد إثبات مبيعات - فاتورة #${invoice.invoice_number}`,
                        lines: je1Lines,
                        entryTypeId: 2 // قيد مبيعات
                    }, { transaction });


                    // --- JE 2: Cost Entry (COGS) ---
                    if (createdItems.length > 0) {
                        // Import FIFO Cost Service
                        const FIFOCostService = (await import('./fifoCost.service.js')).default;

                        // Inventory Account IDs by Product Type
                        const INVENTORY_ACCOUNTS = {
                            FINISHED_GOODS: 110,    // مخزون تام الصنع (منتج تام - type_id: 1)
                            RAW_MATERIALS: 111,     // مخزون أولي (مستلزم انتاج - type_id: 2)
                            WIP: 109,               // تحت التشغيل (type_id: 3 or other)
                            DEFAULT: 49             // المخزون (Default fallback)
                        };

                        const PRODUCT_TYPE_TO_ACCOUNT = {
                            1: INVENTORY_ACCOUNTS.FINISHED_GOODS,
                            2: INVENTORY_ACCOUNTS.RAW_MATERIALS,
                            3: INVENTORY_ACCOUNTS.WIP
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
                                const product = productMap.get(Number(itemCost.product_id));
                                const typeId = product ? Number(product.type_id) : null;

                                // Reference from provided table:
                                // 110: مخزون تام الصنع (asset, parent 49)
                                // 111: مخزون أولي (asset, parent 49)
                                // 109: تحت التشغيل (asset, parent 49)
                                let accountId = INVENTORY_ACCOUNTS.DEFAULT;
                                if (typeId === 1) accountId = INVENTORY_ACCOUNTS.FINISHED_GOODS;
                                else if (typeId === 2) accountId = INVENTORY_ACCOUNTS.RAW_MATERIALS;
                                else if (typeId === 3) accountId = INVENTORY_ACCOUNTS.WIP;

                                console.log(`Product ID: ${itemCost.product_id}, Type ID: ${typeId}, Resolved Account ID: ${accountId}`);

                                if (!costsByType[accountId]) {
                                    costsByType[accountId] = 0;
                                }
                                costsByType[accountId] += Number(itemCost.cost) || 0;
                            }
                        } catch (error) {
                            console.error('JE Error: COGS FIFO Calculation Failed:', error.message);
                            // Fallback to product cost_price
                            for (const item of createdItems) {
                                const product = productMap.get(Number(item.product_id));
                                const costPrice = product ? Number(product.cost_price) : 0;
                                if (costPrice > 0) {
                                    const qty = Number(item.quantity) + Number(item.bonus || 0);
                                    const itemCost = qty * costPrice;
                                    totalCost += itemCost;

                                    const typeId = product ? Number(product.type_id) : null;
                                    let accountId = INVENTORY_ACCOUNTS.DEFAULT;
                                    if (typeId === 1) accountId = INVENTORY_ACCOUNTS.FINISHED_GOODS;
                                    else if (typeId === 2) accountId = INVENTORY_ACCOUNTS.RAW_MATERIALS;
                                    else if (typeId === 3) accountId = INVENTORY_ACCOUNTS.WIP;

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

                                // Final check: ensure the entry is balanced
                                const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
                                const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);

                                if (Math.abs(totalDebit - totalCredit) > 0.01) {
                                    console.warn(`JE Warning: COGS Entry for SI #${invoice.id} is unbalanced (D:${totalDebit}, C:${totalCredit}). Adjusting...`);
                                    // Adjust the first credit line or add a fallback credit line if none exist
                                    if (lines.length > 1) {
                                        lines[1].credit += (totalDebit - totalCredit);
                                    } else {
                                        lines.push({
                                            account_id: INVENTORY_ACCOUNTS.DEFAULT,
                                            debit: 0,
                                            credit: totalDebit,
                                            description: `المخزون (تعديل تلقائي) - فاتورة #${invoice.invoice_number}`
                                        });
                                    }
                                }

                                await createJournalEntry({
                                    refCode: 'sales_invoice_cost',
                                    refId: invoice.id,
                                    entryDate: invoice.invoice_date,
                                    description: `قيد تكلفة مبيعات - فاتورة #${invoice.invoice_number}`,
                                    lines,
                                    entryTypeId: 2 // قيد فاتورة مبيعات
                                }, { transaction });
                                console.log('JE Success: SI Professional COGS Entry Created');
                            } catch (err) {
                                console.error('JE Error: SI Professional COGS Entry Failed', err);
                            }
                        }
                    }
                }
            } else {
                // If status is not approved, we still need to create items but without inventory/JE
                if (items && items.length > 0) {
                    const itemsWithInvoiceId = items.map(item => ({
                        ...item,
                        sales_invoice_id: invoice.id,
                        warehouse_id: item.warehouse_id || invoice.warehouse_id || null
                    }));
                    await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });
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

            // [RESTRICTION] Only allow updates if status is 'draft'
            if (invoice.invoice_status !== 'draft') {
                throw new Error('لا يمكن تعديل الفاتورة إلا إذا كانت في حالة مسودة (Draft)');
            }

            const invoice_type = invoiceData.invoice_type || invoice.invoice_type;
            if (invoice_type === 'opening' && items && items.length > 0) {
                await transaction.rollback();
                throw new Error('لا يمكن إضافة عناصر لفاتورة افتتاحية');
            }

            // 1. Remove ALL existing side effects (Inventory Transactions and Journal Entries)
            // We do this regardless of the new status, and then recreate them only if 'approved'
            const oldItems = await SalesInvoiceItem.findAll({
                where: { sales_invoice_id: id },
                transaction
            });
            const oldItemIds = oldItems.map(i => i.id);

            // Remove Inventory Transactions
            const oldTransactions = await InventoryTransaction.findAll({
                where: {
                    source_type: 'sales_invoice',
                    source_id: { [Op.in]: oldItemIds }
                },
                transaction
            });
            for (const trx of oldTransactions) {
                await InventoryTransactionService.remove(trx.id, { transaction });
            }

            // Remove Journal Entries
            const { JournalEntry, ReferenceType } = await import('../models/index.js');
            const refTypes = await ReferenceType.findAll({
                where: { code: ['sales_invoice', 'sales_invoice_cost', 'sales_invoice_opening'] },
                transaction
            });
            const refTypeIds = refTypes.map(rt => rt.id);
            if (refTypeIds.length > 0) {
                await JournalEntry.destroy({
                    where: {
                        reference_type_id: { [Op.in]: refTypeIds },
                        reference_id: id
                    },
                    transaction
                });
            }

            // 2. Update Invoice Header
            if (items !== undefined && items.length > 0) {
                invoiceData.vat_amount = items.reduce((sum, item) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 0;
                    const disc = Number(item.discount) || 0;
                    const vatRate = Number(item.vat_rate) || 0;
                    const itemVat = (qty * price - disc) * (vatRate / 100);
                    item.vat_amount = itemVat;
                    return sum + itemVat;
                }, 0);
            }

            await invoice.update(invoiceData, { transaction });
            await invoice.reload({ transaction }); // Ensure we have the latest status

            console.log(`Service: Invoice updated. ID: ${id}, Status: ${invoice.invoice_status}`);

            // 3. Handle Items (Update/Create/Delete)
            let processedItems = [];
            if (items !== undefined) {
                const existingItems = await SalesInvoiceItem.findAll({
                    where: { sales_invoice_id: id },
                    transaction
                });

                const payloadItemIds = items.filter(i => i.id).map(i => i.id);
                const itemsToDelete = existingItems.filter(ei => !payloadItemIds.includes(ei.id));
                const itemsToUpdate = items.filter(i => i.id);
                const itemsToCreate = items.filter(i => !i.id);

                for (const item of itemsToDelete) {
                    await item.destroy({ transaction });
                }

                for (const itemData of itemsToUpdate) {
                    const item = existingItems.find(ei => ei.id === itemData.id);
                    if (item) {
                        await item.update({
                            ...itemData,
                            sales_invoice_id: id,
                            warehouse_id: itemData.warehouse_id || invoice.warehouse_id || null
                        }, { transaction });
                        processedItems.push(item);
                    }
                }

                for (const itemData of itemsToCreate) {
                    const newItem = await SalesInvoiceItem.create({
                        ...itemData,
                        sales_invoice_id: id,
                        warehouse_id: itemData.warehouse_id || invoice.warehouse_id || null
                    }, { transaction });
                    processedItems.push(newItem);
                }
            } else {
                processedItems = await SalesInvoiceItem.findAll({
                    where: { sales_invoice_id: id },
                    transaction
                });
            }

            // 4. Recreate Side Effects ONLY if status is 'approved'
            if (invoice.invoice_status === 'approved') {
                console.log('Service: Status is approved, recreating side effects');
                // --- Inventory Transactions ---
                if (processedItems.length > 0) {
                    const FIFOCostService = (await import('./fifoCost.service.js')).default;
                    const itemsForCost = processedItems.map(item => ({
                        product_id: item.product_id,
                        warehouse_id: item.warehouse_id || invoice.warehouse_id,
                        quantity: Number(item.quantity) + Number(item.bonus || 0)
                    }));

                    let fifoBatchesMap = new Map();
                    try {
                        const { itemCosts } = await FIFOCostService.calculateFIFOCostForItems(itemsForCost, transaction);
                        for (const itemCost of itemCosts) {
                            const linkedItem = processedItems.find(pi => pi.product_id === itemCost.product_id);
                            if (linkedItem) {
                                fifoBatchesMap.set(linkedItem.id, itemCost.batches);
                            }
                        }
                    } catch (error) {
                        console.error('FIFO batch calculation failed in update:', error.message);
                    }

                    for (const item of processedItems) {
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

                // --- Journal Entries ---
                const { createJournalEntry } = await import('./journal.service.js');
                const SALES_ACCOUNT_ID = 28;
                const CUSTOMER_ACCOUNT_ID = 47;
                const VAT_ACCOUNT_ID = 65;
                const TAX_ACCOUNT_ID = 66;
                const DISCOUNT_ALLOWED_ID = 108;
                const COGS_ACCOUNT_ID = 15;
                const OPENING_BALANCE_OFFSET_ID = 117;

                const subtotal = Number(invoice.subtotal) || 0;
                const shippingAmount = Number(invoice.shipping_amount) || 0;
                const vatAmount = Number(invoice.vat_amount) || 0;
                const taxAmount = Number(invoice.tax_amount) || 0;
                const discount = Number(invoice.additional_discount) || 0;
                const finalTotal = Number(invoice.total_amount) || 0;

                if (invoice.invoice_type === 'opening') {
                    await createJournalEntry({
                        refCode: 'sales_invoice_opening',
                        refId: invoice.id,
                        entryDate: invoice.invoice_date,
                        description: `رصيد أول المدة - فاتورة #${invoice.invoice_number}`,
                        lines: [
                            {
                                account_id: invoice.account_id || CUSTOMER_ACCOUNT_ID,
                                debit: finalTotal,
                                credit: 0,
                                description: `إثبات رصيد افتتاحى للعميل - فاتورة #${invoice.invoice_number}`
                            },
                            {
                                account_id: OPENING_BALANCE_OFFSET_ID,
                                debit: 0,
                                credit: finalTotal,
                                description: `مقابل رصيد افتتاحى - فاتورة #${invoice.invoice_number}`
                            }
                        ],
                        entryTypeId: 1
                    }, { transaction });
                } else {
                    const je1Lines = [];
                    je1Lines.push({
                        account_id: SALES_ACCOUNT_ID,
                        debit: 0,
                        credit: subtotal,
                        description: `إيراد مبيعات - فاتورة #${invoice.invoice_number}`
                    });

                    if (shippingAmount > 0) {
                        je1Lines.push({
                            account_id: 115,
                            debit: 0,
                            credit: shippingAmount,
                            description: `إيراد شحن - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    if (vatAmount > 0) {
                        je1Lines.push({
                            account_id: VAT_ACCOUNT_ID,
                            debit: 0,
                            credit: vatAmount,
                            description: `ضريبة القيمة المضافة - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    if (taxAmount > 0) {
                        je1Lines.push({
                            account_id: TAX_ACCOUNT_ID,
                            debit: 0,
                            credit: taxAmount,
                            description: `ضرائب أخرى - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    if (discount > 0) {
                        je1Lines.push({
                            account_id: DISCOUNT_ALLOWED_ID,
                            debit: discount,
                            credit: 0,
                            description: `خصم مسموح به - فاتورة #${invoice.invoice_number}`
                        });
                    }

                    je1Lines.push({
                        account_id: invoice.account_id || CUSTOMER_ACCOUNT_ID,
                        debit: finalTotal,
                        credit: 0,
                        description: invoice.account_id ? `متحصلات مبيعات - فاتورة #${invoice.invoice_number}` : `مديونية عميل - فاتورة #${invoice.invoice_number}`
                    });

                    await createJournalEntry({
                        refCode: 'sales_invoice',
                        refId: invoice.id,
                        entryDate: invoice.invoice_date,
                        description: `قيد إثبات مبيعات - فاتورة #${invoice.invoice_number}`,
                        lines: je1Lines,
                        entryTypeId: 2
                    }, { transaction });
                    console.log('Service: Invoice Journal Entry Created');

                    // COGS Entry
                    if (processedItems.length > 0) {
                        const FIFOCostService = (await import('./fifoCost.service.js')).default;
                        const INVENTORY_ACCOUNTS = {
                            FINISHED_GOODS: 110,
                            RAW_MATERIALS: 111,
                            WIP: 109,
                            DEFAULT: 49
                        };

                        const itemsForCost = processedItems.map(item => ({
                            product_id: item.product_id,
                            warehouse_id: item.warehouse_id || invoice.warehouse_id,
                            quantity: Number(item.quantity) + Number(item.bonus || 0)
                        }));

                        const productIds = processedItems.map(i => i.product_id);
                        const products = await Product.findAll({
                            where: { id: { [Op.in]: productIds } },
                            transaction
                        });
                        const productMap = new Map(products.map(p => [p.id, p]));

                        let costsByType = {};
                        let totalCost = 0;

                        try {
                            const { totalCost: fifoCost, itemCosts } = await FIFOCostService.calculateFIFOCostForItems(itemsForCost, transaction);
                            totalCost = fifoCost;
                            for (const itemCost of itemCosts) {
                                const product = productMap.get(Number(itemCost.product_id));
                                const typeId = product ? Number(product.type_id) : null;
                                let accountId = INVENTORY_ACCOUNTS.DEFAULT;
                                if (typeId === 1) accountId = INVENTORY_ACCOUNTS.FINISHED_GOODS;
                                else if (typeId === 2) accountId = INVENTORY_ACCOUNTS.RAW_MATERIALS;
                                else if (typeId === 3) accountId = INVENTORY_ACCOUNTS.WIP;

                                if (!costsByType[accountId]) costsByType[accountId] = 0;
                                costsByType[accountId] += Number(itemCost.cost) || 0;
                            }
                        } catch (error) {
                            for (const item of processedItems) {
                                const product = productMap.get(Number(item.product_id));
                                const costPrice = product ? Number(product.cost_price) : 0;
                                if (costPrice > 0) {
                                    const qty = Number(item.quantity) + Number(item.bonus || 0);
                                    const itemCost = qty * costPrice;
                                    totalCost += itemCost;
                                    const typeId = product ? Number(product.type_id) : null;
                                    let accountId = INVENTORY_ACCOUNTS.DEFAULT;
                                    if (typeId === 1) accountId = INVENTORY_ACCOUNTS.FINISHED_GOODS;
                                    else if (typeId === 2) accountId = INVENTORY_ACCOUNTS.RAW_MATERIALS;
                                    else if (typeId === 3) accountId = INVENTORY_ACCOUNTS.WIP;
                                    if (!costsByType[accountId]) costsByType[accountId] = 0;
                                    costsByType[accountId] += itemCost;
                                }
                            }
                        }

                        if (totalCost > 0) {
                            const lines = [{
                                account_id: COGS_ACCOUNT_ID,
                                debit: totalCost,
                                credit: 0,
                                description: `تكلفة البضاعة المباعة - فاتورة #${invoice.invoice_number}`
                            }];
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
        throw new Error('حذف فواتير المبيعات غير مسموح به نهائياً');
    }
};
