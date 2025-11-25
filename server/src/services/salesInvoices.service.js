import { SalesInvoice, SalesInvoiceItem, sequelize } from "../models/index.js";

export default {
    getAll: async () => {
        return await SalesInvoice.findAll({
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "account" },
                { association: "sales_order" }
            ]
        });
    },

    getById: async (id) => {
        return await SalesInvoice.findByPk(id, {
            include: [
                { association: "party" },
                { association: "warehouse" },
                { association: "employee" },
                { association: "account" },
                { association: "sales_order" },
                { association: "items", include: ["product"] }
            ]
        });
    },

    create: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            console.log('Service: Starting invoice creation');
            const { items, ...invoiceData } = data;
            console.log('Service: Invoice data:', invoiceData);
            console.log('Service: Items count:', items?.length || 0);

            // Create the invoice
            const invoice = await SalesInvoice.create(invoiceData, { transaction });
            console.log('Service: Invoice created with ID:', invoice.id);

            // Create items if they exist
            if (items && items.length > 0) {
                const itemsWithInvoiceId = items.map(item => ({
                    ...item,
                    sales_invoice_id: invoice.id
                }));
                console.log('Service: Creating items:', JSON.stringify(itemsWithInvoiceId, null, 2));
                await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });
                console.log('Service: Items created successfully');
            }

            await transaction.commit();
            console.log('Service: Transaction committed');
            return invoice;
        } catch (error) {
            console.error('Service: Error occurred:', error.message);
            console.error('Service: Error stack:', error.stack);
            await transaction.rollback();
            console.log('Service: Transaction rolled back');
            throw error;
        }
    },

    update: async (id, data) => {
        const transaction = await sequelize.transaction();
        try {
            const { items, ...invoiceData } = data;

            const invoice = await SalesInvoice.findByPk(id, { transaction });
            if (!invoice) {
                await transaction.rollback();
                return null;
            }

            // Update the invoice
            await invoice.update(invoiceData, { transaction });

            // Delete existing items and create new ones
            if (items !== undefined) {
                await SalesInvoiceItem.destroy({
                    where: { sales_invoice_id: id },
                    transaction
                });

                if (items.length > 0) {
                    const itemsWithInvoiceId = items.map(item => ({
                        ...item,
                        sales_invoice_id: id
                    }));
                    await SalesInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });
                }
            }

            await transaction.commit();
            return invoice;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    delete: async (id) => {
        const row = await SalesInvoice.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return true;
    }
};
