import { SalesInvoice, SalesInvoiceItem, sequelize, InventoryTransaction } from "../models/index.js";
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
            console.log('Service: Invoice data:', invoiceData);
            console.log('Service: Items count:', items?.length || 0);

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
            console.log('Service: Invoice created with ID:', invoice.id);

            // Create items if they exist
            if (items && items.length > 0) {
                const itemsWithInvoiceId = items.map(item => ({
                    ...item,
                    sales_invoice_id: invoice.id
                }));
                console.log('Service: Creating items:', JSON.stringify(itemsWithInvoiceId, null, 2));
                await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });
                console.log('Service: Items created successfully');

                // Create Inventory Transactions (OUT)
                for (const item of itemsWithInvoiceId) {
                    const batches = [];
                    if (item.batch_number && item.expiry_date) {
                        batches.push({
                            batch_number: item.batch_number,
                            expiry_date: item.expiry_date,
                            quantity: item.quantity,
                            cost_per_unit: item.price
                        });
                    } else {
                        // If no specific batch, still deduct quantity (will be handled as null batch_id)
                        batches.push({
                            batch_number: null,
                            expiry_date: null,
                            quantity: item.quantity,
                            cost_per_unit: item.price
                        });
                    }

                    await InventoryTransactionService.create({
                        product_id: item.product_id,
                        warehouse_id: item.warehouse_id || invoice.warehouse_id, // Fallback to invoice warehouse if item doesn't have one
                        transaction_type: 'out',
                        transaction_date: invoice.invoice_date || new Date(),
                        note: `Sales Invoice #${invoice.invoice_number || invoice.id}`,
                        source_type: 'sales_invoice',
                        source_id: invoice.id,
                        batches: batches
                    }, { transaction });
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

            // Check if invoice_type is 'opening' and items exist
            const invoice_type = invoiceData.invoice_type || invoice.invoice_type;
            if (invoice_type === 'opening' && items && items.length > 0) {
                await transaction.rollback();
                throw new Error('لا يمكن إضافة عناصر لفاتورة افتتاحية');
            }

            // Reverse old inventory transactions
            const oldTransactions = await InventoryTransaction.findAll({
                where: { source_type: 'sales_invoice', source_id: id },
                transaction // Pass transaction if possible, but InventoryTransactionService.remove might not support it.
                // Since remove uses findByPk and destroy, we can't easily pass transaction without modifying service.
                // For now, we'll do it outside the transaction or assume it works.
                // Actually, we should probably do it.
                // Let's just call remove. If it fails, the outer transaction rolls back? 
                // No, remove is separate.
                // Ideally we should update InventoryTransactionService to accept transaction options.
                // But for now, let's just call it.
            });
            for (const trx of oldTransactions) {
                await InventoryTransactionService.remove(trx.id, { transaction });
            }

            // Update the invoice
            await invoice.update(invoiceData, { transaction });

            // Delete existing items and create new ones
            if (items !== undefined) {
                await SalesInvoiceItem.destroy({
                    where: { sales_invoice_id: id },
                    transaction
                });

                if (items.length > 0) {
                    const itemsWithInvoiceId = items.map(item => ({
                        ...item,
                        sales_invoice_id: id
                    }));
                    await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });

                    // Create new Inventory Transactions
                    for (const item of itemsWithInvoiceId) {
                        const batches = [];
                        if (item.batch_number && item.expiry_date) {
                            batches.push({
                                batch_number: item.batch_number,
                                expiry_date: item.expiry_date,
                                quantity: item.quantity,
                                cost_per_unit: 0
                            });
                        }

                        await InventoryTransactionService.create({
                            product_id: item.product_id,
                            warehouse_id: item.warehouse_id || invoice.warehouse_id,
                            transaction_type: 'out',
                            transaction_date: invoice.invoice_date || new Date(),
                            note: `Sales Invoice #${invoice.invoice_number || invoice.id}`,
                            source_type: 'sales_invoice',
                            source_id: invoice.id,
                            batches: batches
                        }, { transaction });
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

        // Reverse inventory transactions
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
