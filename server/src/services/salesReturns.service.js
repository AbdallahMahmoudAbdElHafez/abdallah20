import { SalesReturn } from "../models/index.js";

export default {
    getAll: async () => {
        return await SalesReturn.findAll({ include: ["customer", "invoice", "warehouse"] });
    },

    getById: async (id) => {
        return await SalesReturn.findByPk(id, { include: ["customer", "invoice", "warehouse"] });
    },

    create: async (data) => {
        return await SalesReturn.create(data);
    },

    update: async (id, data) => {
        const row = await SalesReturn.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await SalesReturn.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
