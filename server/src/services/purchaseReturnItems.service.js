import { PurchaseReturnItem } from "../models/index.js";

export default {
    getAll: async () => {
        return await PurchaseReturnItem.findAll();
    },

    getById: async (id) => {
        return await PurchaseReturnItem.findByPk(id);
    },

    create: async (data) => {
        return await PurchaseReturnItem.create(data);
    },

    update: async (id, data) => {
        const row = await PurchaseReturnItem.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await PurchaseReturnItem.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    },
};
