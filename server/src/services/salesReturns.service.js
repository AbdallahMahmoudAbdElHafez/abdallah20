import { SalesReturn, SalesReturnItem, sequelize, InventoryTransaction, InventoryTransactionBatches, Account, Product, SalesInvoice, SalesInvoiceItem } from "../models/index.js";
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
                { association: "items", include: ["product"] }
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
                { association: "items", include: ["product"] }
            ]
        });
    },

    create: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            const { items, ...returnData } = data;

            // 1. Validate & Link Invoice
            if (!returnData.sales_invoice_id) {
                throw new Error("Sales Return must be linked to a Sales Invoice.");
            }
            const invoice = await SalesInvoice.findByPk(returnData.sales_invoice_id, {
                include: ["items"],
                transaction
            });
            if (!invoice) {
                throw new Error("Sales Invoice not found.");
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
                    unitPrice = Number(item.price) || Number(product.sale_price) || 0;
                } else {
                    // Find original invoice item
                    originalItem = invoice.items.find(i => i.product_id == item.product_id);
                    if (!originalItem) {
                        throw new Error(`Product ${item.product_id} not found in original Invoice.`);
                    }
                    unitPrice = Number(originalItem.price);

                    // 2a. Cumulative Validation - Don't return more than sold across all returns
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

                if (!item.return_condition) {
                    throw new Error(`Return condition is required for product ${item.product_id}.`);
                }

                // 3. Financial Calculation (Pro-rated)
                const returnQty = Number(item.quantity);
                const lineGross = unitPrice * returnQty;

                const invoiceSubtotal = Number(invoice.subtotal);
                const invoiceDiscount = Number(invoice.additional_discount);
                const globalDiscountRate = invoiceSubtotal > 0 ? (invoiceDiscount / invoiceSubtotal) : 0;

                const lineDiscountInfo = item.is_manual ? 0 : (lineGross * globalDiscountRate); // Pro-rated discount for this return line (manual items usually don't get pro-rated discount from invoice)
                const lineNet = lineGross - lineDiscountInfo;

                // Validate Tax
                const vatRate = Number(invoice.vat_rate) / 100 || 0;
                const lineTax = lineNet * vatRate;

                totalReturnGross += lineGross;
                totalReturnDiscount += lineDiscountInfo;
                totalReturnNet += lineNet;
                totalReturnTax += lineTax;

                processedItems.push({
                    sales_return_id: null, // set later
                    sales_invoice_id: invoice.id,
                    product_id: item.product_id,
                    quantity: returnQty,
                    price: unitPrice,
                    return_condition: item.return_condition
                });

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
                    // Manual item or no original item: use Product Master Cost
                    const product = await Product.findByPk(item.product_id, { transaction });
                    originalCostPerUnit = Number(product.cost_price);
                }

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
            const salesReturn = await SalesReturn.create({
                ...returnData,
                return_type: returnData.return_type || 'cash' // Validation handled below
            }, { transaction });

            // 5. Create Items and Stock In
            const createdItems = [];
            for (const pItem of processedItems) {
                pItem.sales_return_id = salesReturn.id;
                const newItem = await SalesReturnItem.create(pItem, { transaction });
                createdItems.push(newItem);

                // --- INVENTORY TRANSACTION (Only Good) ---
                if (newItem.return_condition === 'good') {
                    await InventoryTransactionService.create({
                        product_id: newItem.product_id,
                        warehouse_id: salesReturn.warehouse_id,
                        transaction_type: 'in',
                        transaction_date: salesReturn.return_date,
                        note: `Sales Return #${salesReturn.id} (Good)`,
                        source_type: 'sales_return',
                        source_id: newItem.id,
                        batches: [] // Logic for batches would be complex, keeping simple for now
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
                if (returnData.treasury_account_id) {
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
            const ACC_INVENTORY_DEF = 49;
            const ACC_DAMAGED = 112;
            const ACC_EXPIRED = 113;

            const je2Lines = [];
            let totalCostReversed = 0;

            for (const item of costReversalItems) {
                if (item.totalCost <= 0) continue;
                totalCostReversed += item.totalCost;

                let debitAcc = ACC_INVENTORY_DEF;

                if (item.condition === 'good') {
                    // Logic: Type 1 -> 110, Type 2 -> 111, Else -> 49
                    if (item.type_id === 1) debitAcc = ACC_INVENTORY_GOODS;
                    else if (item.type_id === 2) debitAcc = ACC_INVENTORY_RAW;
                    else debitAcc = ACC_INVENTORY_DEF; // Fallback
                } else if (item.condition === 'damaged') {
                    debitAcc = ACC_DAMAGED;
                } else if (item.condition === 'expired') {
                    debitAcc = ACC_EXPIRED;
                }

                // Aggregate per account if possible, but distinct lines are fine for clarity
                je2Lines.push({
                    account_id: debitAcc,
                    debit: item.totalCost,
                    credit: 0,
                    description: `Restock/Write-off (${item.condition}) - Item ${item.product_id}`
                });
            }

            if (totalCostReversed > 0) {
                // Credit COGS
                je2Lines.push({
                    account_id: ACC_COGS,
                    debit: 0,
                    credit: totalCostReversed,
                    description: `COGS Reversal - Return #${salesReturn.id}`
                });

                await createJournalEntry({
                    refCode: 'sales_return', // Using same refCode to link easier or differentiate if system allows multiple
                    refId: salesReturn.id,
                    entryDate: salesReturn.return_date,
                    description: `تكلة مبيعات (مرتجع) فاتورة #${invoice.invoice_number}`,
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
        return await SalesReturn.update(data, { where: { id } });
    },

    delete: async (id) => {
        return await SalesReturn.destroy({ where: { id } });
    }
};
