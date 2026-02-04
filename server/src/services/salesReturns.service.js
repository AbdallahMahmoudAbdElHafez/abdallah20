import { SalesReturn, SalesReturnItem, sequelize, InventoryTransaction, InventoryTransactionBatches, Account, Product, SalesInvoice, SalesInvoiceItem, ReferenceType } from "../models/index.js";
import { Op } from "sequelize";
import InventoryTransactionService from './inventoryTransaction.service.js';

export default {
    getAll: async () => {
        return await SalesReturn.findAll({
            include: [
                {
                    association: "invoice",
                    include: ["party"]
                },
                { association: "items", include: ["product"] },
                { association: "employee" }
            ]
        });
    },

    getById: async (id) => {
        return await SalesReturn.findByPk(id, {
            include: [
                {
                    association: "invoice",
                    include: ["party"]
                },
                { association: "items", include: ["product"] },
                { association: "employee" }
            ]
        });
    },

    create: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            // Ensure Reference Types exist
            const [refType] = await ReferenceType.findOrCreate({
                where: { code: 'sales_return' },
                defaults: {
                    label: 'مرتجع مبيعات',
                    description: 'Transactions for Sales Returns'
                },
                transaction
            });

            const [refTypeCost] = await ReferenceType.findOrCreate({
                where: { code: 'sales_return_cost' },
                defaults: {
                    label: 'تكلفة مرتجع مبيعات',
                    description: 'Cost Reversal for Sales Returns'
                },
                transaction
            });

            const { items, ...returnData } = data;

            // Sanitize integer fields: convert empty string to null
            if (returnData.account_id === "") returnData.account_id = null;
            if (returnData.sales_invoice_id === "") returnData.sales_invoice_id = null;

            // 1. Validate & Link Invoice
            if (!returnData.sales_invoice_id) {
                // throw new Error("Sales Return must be linked to a Sales Invoice."); // Allowed to be null in schema? Schema says DEFAULT NULL for sales_invoice_id, but prompt validation might require it logic-wise. 
                // However, schema says party_id NOT NULL.
            }
            // Validate Party
            if (!returnData.party_id) {
                throw new Error("Party (Customer) is required for Sales Return.");
            }

            let invoice = null;
            if (returnData.sales_invoice_id) {
                invoice = await SalesInvoice.findByPk(returnData.sales_invoice_id, {
                    include: ["items"],
                    transaction
                });
                if (!invoice) {
                    throw new Error("Sales Invoice not found.");
                }
            }

            // 2. Validate Items & Quantities
            // Map items to original invoice items for validation
            const processedItems = [];
            let totalReturnNet = 0; // Net Sales to reverse (Gross - Discount)
            let totalReturnGross = 0; // Gross Sales to reverse (Price * Qty)
            let totalReturnDiscount = 0; // Discount to reverse
            let totalReturnTax = 0; // Tax to reverse

            // Prepare Cost Reversal Data
            const costReversalItems = [];

            for (const item of items) {
                let unitPrice = 0;
                let originalItem = null;

                if (item.is_manual) {
                    // For manual items, use the price provided by frontend or product master
                    const product = await Product.findByPk(item.product_id, { transaction });
                    if (!product) throw new Error(`Product ${item.product_id} not found.`);
                    unitPrice = Number(item.price) || Number(product.price) || 0;
                } else {
                    // Find original invoice item
                    if (invoice) {
                        originalItem = invoice.items.find(i => i.product_id == item.product_id);
                        if (!originalItem) {
                            // If linked to invoice, item must exist there? Or allow loose returns?
                            // For now, strict if invoice linked.
                            throw new Error(`Product ${item.product_id} not found in original Invoice.`);
                        }
                        // Prioritize price from request if provided, otherwise fallback to original item price
                        unitPrice = (item.price !== undefined && item.price !== null) ? Number(item.price) : Number(originalItem.price);
                    } else {
                        // No invoice linked, must rely on manual price or product price
                        const product = await Product.findByPk(item.product_id, { transaction });
                        unitPrice = (item.price !== undefined && item.price !== null) ? Number(item.price) : (Number(product.price) || 0);
                    }

                    // 2a. Cumulative Validation - Don't return more than sold across all returns (Only if invoice linked)
                    if (invoice && originalItem) {
                        const previousReturns = await SalesReturnItem.findAll({
                            include: [{
                                association: "sales_return",
                                where: { sales_invoice_id: invoice.id }
                            }],
                            where: {
                                product_id: item.product_id
                            },
                            transaction
                        });
                        const alreadyReturned = previousReturns.reduce((sum, r) => sum + Number(r.quantity), 0);
                        const totalAttempted = alreadyReturned + Number(item.quantity);

                        if (totalAttempted > Number(originalItem.quantity)) {
                            throw new Error(`Total returned/attempted quantity (${totalAttempted}) for product ${item.product_id} exceeds invoiced quantity (${originalItem.quantity}). Previously returned: ${alreadyReturned}.`);
                        }
                    }
                }

                if (!item.return_condition) {
                    throw new Error(`Return condition is required for product ${item.product_id}.`);
                }

                // 3. Financial Calculation (Pro-rated)
                const returnQty = Number(item.quantity);
                const lineGross = unitPrice * returnQty;

                let invoiceSubtotal = 0;
                let invoiceDiscount = 0;
                let globalDiscountRate = 0;
                let vatRate = 0;

                if (invoice) {
                    invoiceSubtotal = Number(invoice.subtotal);
                    invoiceDiscount = Number(invoice.additional_discount);
                    globalDiscountRate = invoiceSubtotal > 0 ? (invoiceDiscount / invoiceSubtotal) : 0;
                    vatRate = Number(invoice.vat_rate) / 100 || 0;
                }

                const lineDiscountInfo = item.is_manual ? 0 : (lineGross * globalDiscountRate); // Pro-rated discount for this return line (manual items usually don't get pro-rated discount from invoice)
                const lineNet = lineGross - lineDiscountInfo;

                // Validate Tax
                // vatRate defined above
                const lineTax = lineNet * vatRate;

                totalReturnGross += lineGross;
                totalReturnDiscount += lineDiscountInfo;
                totalReturnNet += lineNet;
                totalReturnTax += lineTax;

                // 4. Cost Logic Retrieval
                let originalCostPerUnit = 0;

                if (!item.is_manual && originalItem) {
                    // Find original Inventory Transaction (OUT) for this Invoice Item
                    const invTrx = await InventoryTransaction.findOne({
                        where: {
                            source_type: 'sales_invoice',
                            source_id: originalItem.id
                        },
                        include: [{
                            association: 'transaction_batches',
                            attributes: ['quantity', 'cost_per_unit']
                        }],
                        transaction
                    });

                    if (invTrx && invTrx.transaction_batches && invTrx.transaction_batches.length > 0) {
                        // Calculate Weighted Average Cost from the batches used in the sale
                        let totalBatchCost = 0;
                        let totalBatchQty = 0;

                        for (const b of invTrx.transaction_batches) {
                            const qty = Number(b.quantity);
                            const cost = Number(b.cost_per_unit);
                            totalBatchCost += (qty * cost);
                            totalBatchQty += qty;
                        }

                        if (totalBatchQty > 0) {
                            originalCostPerUnit = totalBatchCost / totalBatchQty;
                        } else {
                            const product = await Product.findByPk(item.product_id, { transaction });
                            originalCostPerUnit = Number(product.cost_price);
                        }
                    } else {
                        const product = await Product.findByPk(item.product_id, { transaction });
                        originalCostPerUnit = Number(product.cost_price);
                    }
                } else {
                    // Manual item or no original item: Attempt to use Oldest Available Batch Cost (FIFO)
                    const { BatchInventory, Batches, InventoryTransaction, InventoryTransactionBatches } = await import("../models/index.js");

                    // 1. Find all batches for this product with positive inventory
                    const availableBatches = await BatchInventory.findAll({
                        attributes: ['batch_id'],
                        where: { quantity: { [Op.gt]: 0 } },
                        include: [{
                            model: Batches,
                            as: 'batch',
                            where: { product_id: item.product_id },
                            attributes: []
                        }],
                        group: ['batch_id'], // Distinct batches
                        transaction
                    });

                    let foundCost = 0;

                    if (availableBatches.length > 0) {
                        const batchIds = availableBatches.map(b => b.batch_id);

                        // 2. Find the oldest IN transaction for these batches to get the cost
                        const oldestBatchTrx = await InventoryTransactionBatches.findOne({
                            where: {
                                batch_id: { [Op.in]: batchIds },
                                cost_per_unit: { [Op.gt]: 0 } // Ensure it has a cost
                            },
                            include: [{
                                model: InventoryTransaction,
                                as: 'transaction',
                                where: { transaction_type: 'in' }, // Only inbound costs
                                attributes: ['transaction_date']
                            }],
                            order: [
                                [{ model: InventoryTransaction, as: 'transaction' }, 'transaction_date', 'ASC'] // Oldest first
                            ],
                            transaction
                        });

                        if (oldestBatchTrx) {
                            foundCost = Number(oldestBatchTrx.cost_per_unit);
                        }
                    }

                    if (foundCost > 0) {
                        originalCostPerUnit = foundCost;
                    } else {
                        // Fallback to Product Master Cost
                        const product = await Product.findByPk(item.product_id, { transaction });
                        originalCostPerUnit = Number(product.cost_price);
                    }
                }

                processedItems.push({
                    sales_return_id: null, // set later
                    sales_invoice_id: invoice ? invoice.id : null,
                    product_id: item.product_id,
                    quantity: returnQty,
                    price: unitPrice,
                    cost_price: originalCostPerUnit, // Store Cost Price for Inventory Transaction
                    return_condition: item.return_condition,
                    // New Batch Fields
                    batch_number: item.batch_number || null,
                    expiry_date: item.expiry_date || null,
                    batch_status: item.batch_status || 'unknown'
                });

                const productForType = await Product.findByPk(item.product_id, { attributes: ['type_id'], transaction });

                costReversalItems.push({
                    product_id: item.product_id,
                    condition: item.return_condition || 'good',
                    quantity: returnQty,
                    totalCost: originalCostPerUnit * returnQty,
                    type_id: productForType.type_id
                });
            }

            // Create Header
            const finalTotalReturnAmount = totalReturnNet + totalReturnTax; // Or reuse (Gross + Tax - Discount) which is totalPayable?
            // "total_amount" in invoice usually means Final Total Payable. 
            // In model definition comment I said "Net + Tax", but usually we want what the customer owes/is owed.
            // Let's use totalPayable calculated earlier: (totalReturnGross + totalReturnTax) - totalReturnDiscount

            const salesReturn = await SalesReturn.create({
                ...returnData,
                return_type: returnData.return_type || 'cash', // Validation handled below
                total_amount: (totalReturnGross + totalReturnTax) - totalReturnDiscount,
                tax_amount: totalReturnTax
            }, { transaction });

            // 5. Create Items and Stock In
            const createdItems = [];
            for (const pItem of processedItems) {
                pItem.sales_return_id = salesReturn.id;
                const newItem = await SalesReturnItem.create(pItem, { transaction });
                createdItems.push(newItem);

                // --- INVENTORY TRANSACTION (Unified for All Conditions) ---
                // User requested physical tracking for Damaged/Expired as well.
                // We create a transaction 'in' for the selected warehouse.
                // Financials will strictly determine if it's an Asset (Good) or Expense (Damaged/Expired).
                // Physical stock (Qty) will increase regardless.
                if (['good', 'damaged', 'expired'].includes(newItem.return_condition)) {

                    let batchesPayload = [];
                    if (newItem.batch_number) {
                        batchesPayload.push({
                            batch_number: newItem.batch_number,
                            expiry_date: newItem.expiry_date,
                            quantity: newItem.quantity,
                            cost_per_unit: pItem.cost_price, // Use pItem to ensure we get the calculated cost
                            status: newItem.batch_status || 'active'
                        });
                    }

                    await InventoryTransactionService.create({
                        product_id: newItem.product_id,
                        warehouse_id: salesReturn.warehouse_id,
                        transaction_type: 'in',
                        transaction_date: salesReturn.return_date,
                        note: `Sales Return #${salesReturn.id} (${newItem.return_condition})`,
                        source_type: 'sales_return',
                        source_id: newItem.id,
                        batches: batchesPayload
                    }, { transaction });
                }
            }

            // --- JOURNAL ENTRY 1: Revenue Reversal ---
            const { createJournalEntry } = await import('./journal.service.js');
            const ACC_SALES_RETURN = 6;
            const ACC_VAT = 65;
            const ACC_DISCOUNT = 108;

            // Treasury/Customer
            let creditAccount = 0;
            if (returnData.return_type === 'cash') {
                // Precedence: Explicitly defined in data > Inherited from Invoice > Default 41
                if (returnData.account_id) {
                    creditAccount = returnData.account_id;
                } else if (returnData.treasury_account_id) {
                    creditAccount = returnData.treasury_account_id;
                } else {
                    const invoiceWithPayments = await SalesInvoice.findByPk(invoice.id, {
                        include: [{ association: "payments" }],
                        transaction
                    });

                    if (invoiceWithPayments && invoiceWithPayments.payments && invoiceWithPayments.payments.length > 0) {
                        const lastPayment = invoiceWithPayments.payments[invoiceWithPayments.payments.length - 1];
                        if (lastPayment.account_id) creditAccount = lastPayment.account_id;
                    }
                }

                if (!creditAccount) {
                    creditAccount = 41;
                }
            } else {
                // For 'credit' and 'exchange', credit the Customer account
                creditAccount = 47; // Customer
            }

            const je1Lines = [];

            // 1. Debit Sales Returns (Gross Amount)
            je1Lines.push({
                account_id: ACC_SALES_RETURN, // 6
                debit: totalReturnGross,
                credit: 0,
                description: `Sales Return #${salesReturn.id} - Revenue Reversal`
            });

            // 2. Debit VAT (Pro-rated)
            if (totalReturnTax > 0) {
                je1Lines.push({
                    account_id: ACC_VAT, // 65
                    debit: totalReturnTax,
                    credit: 0,
                    description: `VAT Reversal - Return #${salesReturn.id}`
                });
            }

            // 3. Credit Discount (if any)
            if (totalReturnDiscount > 0) {
                je1Lines.push({
                    account_id: ACC_DISCOUNT, // 108
                    debit: 0,
                    credit: totalReturnDiscount,
                    description: `Discount Reversal - Return #${salesReturn.id}`
                });
            }

            // 4. Credit Customer/Cash (Total Payable)
            // Total Payable = Net + Tax [TotalReturnNet + TotalReturnTax] = [Gross - Discount + Tax]
            // Which matches (Gross + Tax) - Discount.
            // Debit Side: Gross + Tax. Credit Side: Discount + (Payable).
            // Payable = (Gross + Tax) - Discount. Correct.
            const totalPayable = (totalReturnGross + totalReturnTax) - totalReturnDiscount;

            je1Lines.push({
                account_id: creditAccount,
                debit: 0,
                credit: totalPayable,
                description: `Refund/Credit - Return #${salesReturn.id}`
            });

            console.log('Attempting to create JE1 for Sales Return:', salesReturn.id);
            console.log('JE1 Lines:', JSON.stringify(je1Lines, null, 2));

            await createJournalEntry({
                refCode: 'sales_return',
                refId: salesReturn.id,
                entryDate: salesReturn.return_date,
                description: `مرتجع مبيعات فاتورة #${invoice.invoice_number}`,
                lines: je1Lines,
                entryTypeId: 4
            }, { transaction });


            // --- JOURNAL ENTRY 2: Cost Reversal ---
            const ACC_COGS = 15;
            const ACC_INVENTORY_GOODS = 110;
            const ACC_INVENTORY_RAW = 111;
            const ACC_INVENTORY_WIP = 109; // Added WIP
            const ACC_INVENTORY_DEF = 49;
            const ACC_DAMAGED = 112; // هالك مرتجعات مبيعات
            const ACC_EXPIRED = 113; // خسائر انتهاء صلاحية مرتجعات

            const je2Lines = [];
            let totalCostReversed = 0;

            // Aggregate costs per account to avoid duplicate lines per item
            const debitAggregation = {};

            for (const item of costReversalItems) {
                if (item.totalCost <= 0) continue;
                totalCostReversed += item.totalCost;

                let debitAcc = ACC_INVENTORY_DEF;

                if (item.condition === 'good') {
                    // Logic: Type 1 -> 110, Type 2 -> 111, Type 3 -> 109, Else -> 49
                    if (item.type_id === 1) debitAcc = ACC_INVENTORY_GOODS;
                    else if (item.type_id === 2) debitAcc = ACC_INVENTORY_RAW;
                    else if (item.type_id === 3) debitAcc = ACC_INVENTORY_WIP;
                    else debitAcc = ACC_INVENTORY_DEF;
                } else if (item.condition === 'damaged') {
                    debitAcc = ACC_DAMAGED;
                } else if (item.condition === 'expired') {
                    debitAcc = ACC_EXPIRED;
                }

                if (!debitAggregation[debitAcc]) {
                    debitAggregation[debitAcc] = 0;
                }
                debitAggregation[debitAcc] += item.totalCost;
            }

            for (const [accId, amount] of Object.entries(debitAggregation)) {
                if (amount > 0) {
                    je2Lines.push({
                        account_id: parseInt(accId),
                        debit: amount,
                        credit: 0,
                        description: `Cost Reversal (Return #${salesReturn.id})`
                    });
                }
            }

            // Balancing Credit to COGS
            if (totalCostReversed > 0) {
                je2Lines.push({
                    account_id: ACC_COGS, // 15
                    debit: 0,
                    credit: totalCostReversed,
                    description: `COGS Reversal - Return #${salesReturn.id}`
                });

                console.log('Attempting to create JE2 (Cost Reversal) for Sales Return:', salesReturn.id);
                console.log('JE2 Lines:', JSON.stringify(je2Lines, null, 2));

                await createJournalEntry({
                    refCode: 'sales_return_cost', // Different refCode to avoid duplicate detection with JE1
                    refId: salesReturn.id,
                    entryDate: salesReturn.return_date,
                    description: `تكلفة مبيعات (مرتجع) فاتورة #${invoice ? invoice.invoice_number : salesReturn.id}`,
                    lines: je2Lines,
                    entryTypeId: 4
                }, { transaction });
            }



            await transaction.commit();
            return salesReturn;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    update: async (id, data) => {
        if (data.account_id === "") data.account_id = null;
        if (data.sales_invoice_id === "") data.sales_invoice_id = null;
        return await SalesReturn.update(data, { where: { id } });
    },

    delete: async (id) => {
        return await SalesReturn.destroy({ where: { id } });
    }
};
