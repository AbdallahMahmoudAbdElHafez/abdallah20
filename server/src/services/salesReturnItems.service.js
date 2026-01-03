import { SalesReturnItem } from "../models/index.js";

export default {
    getAll: async () => {
        return await SalesReturnItem.findAll();
    },

    getById: async (id) => {
        return await SalesReturnItem.findByPk(id);
    },

    getByReturnId: async (sales_return_id) => {
        return await SalesReturnItem.findAll({ where: { sales_return_id } });
    },

    create: async (data) => {
        return await SalesReturnItem.create(data);
    },

    update: async (id, data) => {
        const item = await SalesReturnItem.findByPk(id);
        if (!item) return null;
        await item.update(data);
        return item;
    },

    delete: async (id) => {
        const item = await SalesReturnItem.findByPk(id);
        if (!item) return null;
        await item.destroy();
        return true;
    }
};
