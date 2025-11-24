import { SalesOrderItem } from "../models/index.js";

export default {
    getAll: async () => {
        return await SalesOrderItem.findAll({
            include: [
                { association: "product" },
                { association: "warehouse" }
            ]
        });
    },

    getByOrderId: async (orderId) => {
        return await SalesOrderItem.findAll({
            where: { sales_order_id: orderId },
            include: [
                { association: "product" },
                { association: "warehouse" }
            ]
        });
    },

    getById: async (id) => {
        return await SalesOrderItem.findByPk(id, {
            include: [
                { association: "product" },
                { association: "warehouse" }
            ]
        });
    },

    create: async (data) => {
        return await SalesOrderItem.create(data);
    },

    update: async (id, data) => {
        const row = await SalesOrderItem.findByPk(id);
        if (!row) return null;
        return await row.update(data);
    },

    delete: async (id) => {
        const row = await SalesOrderItem.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
