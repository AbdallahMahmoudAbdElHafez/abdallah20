import { SalesOrder, SalesOrderItem, sequelize, Product } from "../models/index.js";
import CurrentInventoryService from "./currentInventory.service.js";
import SalesInvoicesService from "./salesInvoices.service.js";

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

            const previousStatus = order.status;

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

            // Check if status changed to approved
            if (previousStatus !== 'approved' && orderData.status === 'approved') {
                // Fetch current items (either just updated or existing)
                const currentItems = await SalesOrderItem.findAll({
                    where: { sales_order_id: id },
                    include: ['product'],
                    transaction
                });

                // Inventory Check
                const insufficientItems = [];
                for (const item of currentItems) {
                    const inventory = await CurrentInventoryService.getByProductAndWarehouse(
                        item.product_id,
                        order.warehouse_id
                    );

                    const currentQty = inventory ? Number(inventory.quantity) : 0;
                    if (currentQty < Number(item.quantity)) {
                        insufficientItems.push(item.product ? item.product.name : `Product ID ${item.product_id}`);
                    }
                }

                if (insufficientItems.length > 0) {
                    throw new Error(`الكمية غير كافية للأصناف التالية: ${insufficientItems.join(", ")}`);
                }

                // Create Sales Invoice
                try {
                    const invoiceData = {
                        invoice_number: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        party_id: order.party_id,
                        warehouse_id: order.warehouse_id,
                        employee_id: order.employee_id,
                        invoice_date: new Date(),
                        sales_order_id: order.id,
                        status: 'unpaid',
                        subtotal: order.subtotal,
                        additional_discount: order.additional_discount,
                        vat_rate: order.vat_rate,
                        vat_amount: order.vat_amount,
                        tax_rate: order.tax_rate,
                        tax_amount: order.tax_amount,
                        total_amount: order.total_amount,
                        notes: `تم الإنشاء تلقائياً من طلب البيع رقم ${order.id}`,
                        items: currentItems.map(item => ({
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.price,
                            discount: item.discount,
                            tax_percent: item.tax_percent,
                            tax_amount: item.tax_amount,
                            bonus: item.bonus,
                            warehouse_id: item.warehouse_id
                        }))
                    };

                    console.log('SalesOrdersService: Creating invoice with data:', JSON.stringify(invoiceData, null, 2));
                    await SalesInvoicesService.create(invoiceData, { transaction });
                } catch (invoiceError) {
                    console.error('SalesOrdersService: Error creating invoice:', invoiceError);
                    throw invoiceError;
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
