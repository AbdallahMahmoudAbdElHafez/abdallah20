import { SalesOrder } from "../models/index.js";

export default {
    getAll: async () => {
        return await SalesOrder.findAll({
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" }
            ]
        });
    },

    getById: async (id) => {
        return await SalesOrder.findByPk(id, {
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "items", include: ["product"] }
            ]
        });
    },

    create: async (data) => {
        return await SalesOrder.create(data);
    },

    update: async (id, data) => {
        const row = await SalesOrder.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await SalesOrder.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
