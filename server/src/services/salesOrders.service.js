import { SalesOrder, SalesOrderItem, sequelize } from "../models/index.js";

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
        const transaction = await sequelize.transaction();
        try {
            const { items, ...orderData } = data;

            // Create the order
            const order = await SalesOrder.create(orderData, { transaction });

            // Create items if they exist
            if (items && items.length > 0) {
                const itemsWithOrderId = items.map(item => ({
                    ...item,
                    sales_order_id: order.id
                }));
                await SalesOrderItem.bulkCreate(itemsWithOrderId, { transaction });
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    update: async (id, data) => {
        const transaction = await sequelize.transaction();
        try {
            const { items, ...orderData } = data;

            const order = await SalesOrder.findByPk(id, { transaction });
            if (!order) {
                await transaction.rollback();
                return null;
            }

            // Update the order
            await order.update(orderData, { transaction });

            // Delete existing items and create new ones
            if (items !== undefined) {
                await SalesOrderItem.destroy({
                    where: { sales_order_id: id },
                    transaction
                });

                if (items.length > 0) {
                    const itemsWithOrderId = items.map(item => ({
                        ...item,
                        sales_order_id: id
                    }));
                    await SalesOrderItem.bulkCreate(itemsWithOrderId, { transaction });
                }
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    delete: async (id) => {
        const row = await SalesOrder.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
