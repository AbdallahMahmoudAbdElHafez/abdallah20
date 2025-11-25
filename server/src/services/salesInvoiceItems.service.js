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
        return await SalesInvoiceItem.create(data);
    },

    update: async (id, data) => {
        const row = await SalesInvoiceItem.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await SalesInvoiceItem.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
