import { SalesReturnItem } from "../models/index.js";

export default {
    getAll: async () => {
        return await SalesReturnItem.findAll();
    },

    getById: async (id) => {
        return await SalesReturnItem.findByPk(id);
    },

    create: async (data) => {
        return await SalesReturnItem.create(data);
    },

    update: async (id, data) => {
        const row = await SalesReturnItem.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await SalesReturnItem.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    },
};
