import { SalesInvoiceItem } from "../models/index.js";

export default {
    getAll: async (filters = {}) => {
        const where = {};
        if (filters.sales_invoice_id) {
            where.sales_invoice_id = filters.sales_invoice_id;
        }
        return await SalesInvoiceItem.findAll({
            where,
            include: [
                { association: "product" },
                { association: "warehouse" }
            ]
        });
    },

    getById: async (id) => {
        return await SalesInvoiceItem.findByPk(id, {
            include: [
                { association: "product" },
                { association: "warehouse" }
            ]
        });
    },

    create: async (data) => {
        const item = await SalesInvoiceItem.create(data);

        // Create Inventory Transaction (OUT)
        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;
        const { SalesInvoice } = await import('../models/index.js');

        const invoice = await SalesInvoice.findByPk(item.sales_invoice_id);

        // 1. Transaction for Main Quantity
        if (Number(item.quantity) > 0) {
            const batches = [];
            if (item.batch_number && item.expiry_date) {
                batches.push({
                    batch_number: item.batch_number,
                    expiry_date: item.expiry_date,
                    quantity: item.quantity,
                    cost_per_unit: item.price
                });
            } else {
                batches.push({
                    batch_number: null,
                    expiry_date: null,
                    quantity: item.quantity,
                    cost_per_unit: item.price
                });
            }

            await InventoryTransactionService.create({
                product_id: item.product_id,
                warehouse_id: item.warehouse_id || invoice.warehouse_id,
                transaction_type: 'out',
                transaction_date: invoice?.invoice_date || new Date(),
                note: `Sales Invoice Item #${item.id} (Inv #${invoice?.invoice_number})`,
                source_type: 'sales_invoice',
                source_id: item.id,
                batches: batches
            });
        }

        // 2. Transaction for Bonus
        if (Number(item.bonus) > 0) {
            const bonusBatches = [];
            if (item.batch_number && item.expiry_date) {
                bonusBatches.push({
                    batch_number: item.batch_number,
                    expiry_date: item.expiry_date,
                    quantity: item.bonus,
                    cost_per_unit: 0
                });
            } else {
                bonusBatches.push({
                    batch_number: null,
                    expiry_date: null,
                    quantity: item.bonus,
                    cost_per_unit: 0
                });
            }

            await InventoryTransactionService.create({
                product_id: item.product_id,
                warehouse_id: item.warehouse_id || invoice.warehouse_id,
                transaction_type: 'out',
                transaction_date: invoice?.invoice_date || new Date(),
                note: `Sales Invoice Item #${item.id} (Inv #${invoice?.invoice_number}) (Bonus)`,
                source_type: 'sales_invoice',
                source_id: item.id,
                batches: bonusBatches
            });
        }

        return item;
    },

    update: async (id, data) => {
        const item = await SalesInvoiceItem.findByPk(id);
        if (!item) return null;

        // Reverse old transaction
        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;
        const { InventoryTransaction } = await import('../models/index.js');

        // Find old transaction by source_id = item.id
        const oldTrx = await InventoryTransaction.findOne({
            where: { source_type: 'sales_invoice', source_id: id }
        });

        if (oldTrx) {
            await InventoryTransactionService.remove(oldTrx.id);
        }

        await item.update(data);

        // Create new transaction
        const { SalesInvoice } = await import('../models/index.js');
        const invoice = await SalesInvoice.findByPk(item.sales_invoice_id);

        // 1. Transaction for Main Quantity
        if (Number(item.quantity) > 0) {
            const batches = [];
            if (item.batch_number && item.expiry_date) {
                batches.push({
                    batch_number: item.batch_number,
                    expiry_date: item.expiry_date,
                    quantity: item.quantity,
                    cost_per_unit: item.price
                });
            } else {
                batches.push({
                    batch_number: null,
                    expiry_date: null,
                    quantity: item.quantity,
                    cost_per_unit: item.price
                });
            }

            await InventoryTransactionService.create({
                product_id: item.product_id,
                warehouse_id: item.warehouse_id || invoice.warehouse_id,
                transaction_type: 'out',
                transaction_date: invoice?.invoice_date || new Date(),
                note: `Sales Invoice Item #${item.id} (Inv #${invoice?.invoice_number})`,
                source_type: 'sales_invoice',
                source_id: item.id,
                batches: batches
            });
        }

        // 2. Transaction for Bonus
        if (Number(item.bonus) > 0) {
            const bonusBatches = [];
            if (item.batch_number && item.expiry_date) {
                bonusBatches.push({
                    batch_number: item.batch_number,
                    expiry_date: item.expiry_date,
                    quantity: item.bonus,
                    cost_per_unit: 0
                });
            } else {
                bonusBatches.push({
                    batch_number: null,
                    expiry_date: null,
                    quantity: item.bonus,
                    cost_per_unit: 0
                });
            }

            await InventoryTransactionService.create({
                product_id: item.product_id,
                warehouse_id: item.warehouse_id || invoice.warehouse_id,
                transaction_type: 'out',
                transaction_date: invoice?.invoice_date || new Date(),
                note: `Sales Invoice Item #${item.id} (Inv #${invoice?.invoice_number}) (Bonus)`,
                source_type: 'sales_invoice',
                source_id: item.id,
                batches: bonusBatches
            });
        }

        return item;
    },

    delete: async (id) => {
        const item = await SalesInvoiceItem.findByPk(id);
        if (!item) return null;

        // Reverse transaction
        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;
        const { InventoryTransaction } = await import('../models/index.js');

        const oldTrx = await InventoryTransaction.findOne({
            where: { source_type: 'sales_invoice', source_id: id }
        });

        if (oldTrx) {
            await InventoryTransactionService.remove(oldTrx.id);
        }

        await item.destroy();
        return true;
    }
};
