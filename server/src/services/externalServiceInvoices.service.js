// src/services/externalServiceInvoices.service.js
import {
    ExternalServiceInvoice,
    ExternalServiceInvoiceItem,
    ExternalServiceInvoiceItemTax,
    JobOrderCostTransaction,
    ExternalJobOrder,
    ServiceType,
    Party,
    Account,
    JournalEntry,
    JournalEntryLine,
    ReferenceType,
    sequelize
} from "../models/index.js";

const ExternalServiceInvoicesService = {
    /**
     * Get all service invoices with related data
     */
    getAll: async () => {
        return await ExternalServiceInvoice.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COALESCE(SUM(amount), 0)
                            FROM service_payments
                            WHERE service_payments.external_service_invoice_id = ExternalServiceInvoice.id
                        )`),
                        'paid_amount'
                    ],
                    [
                        sequelize.literal(`(
                            ExternalServiceInvoice.total_amount - (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM service_payments
                                WHERE service_payments.external_service_invoice_id = ExternalServiceInvoice.id
                            )
                        )`),
                        'balance'
                    ]
                ]
            },
            include: [
                { model: ExternalJobOrder, as: 'job_order' },
                { model: Party, as: 'party' },
                {
                    model: ExternalServiceInvoiceItem,
                    as: 'items',
                    include: [
                        { model: ServiceType, as: 'service_type' },
                        { model: ExternalServiceInvoiceItemTax, as: 'taxes' }
                    ]
                }
            ],
            order: [['invoice_date', 'DESC']]
        });
    },

    /**
     * Get invoice by ID
     */
    getById: async (id) => {
        return await ExternalServiceInvoice.findByPk(id, {
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COALESCE(SUM(amount), 0)
                            FROM service_payments
                            WHERE service_payments.external_service_invoice_id = ${id}
                        )`),
                        'paid_amount'
                    ],
                    [
                        sequelize.literal(`(
                            ExternalServiceInvoice.total_amount - (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM service_payments
                                WHERE service_payments.external_service_invoice_id = ${id}
                            )
                        )`),
                        'balance'
                    ]
                ]
            },
            include: [
                { model: ExternalJobOrder, as: 'job_order' },
                { model: Party, as: 'party' },
                { model: JournalEntry, as: 'journal_entry' },
                {
                    model: ExternalServiceInvoiceItem,
                    as: 'items',
                    include: [
                        { model: ServiceType, as: 'service_type' },
                        { model: ExternalServiceInvoiceItemTax, as: 'taxes' }
                    ]
                }
            ]
        });
    },

    /**
     * Get invoices by job order ID
     */
    getByJobOrderId: async (jobOrderId) => {
        return await ExternalServiceInvoice.findAll({
            where: { job_order_id: jobOrderId },
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COALESCE(SUM(amount), 0)
                            FROM service_payments
                            WHERE service_payments.external_service_invoice_id = ExternalServiceInvoice.id
                        )`),
                        'paid_amount'
                    ],
                    [
                        sequelize.literal(`(
                            ExternalServiceInvoice.total_amount - (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM service_payments
                                WHERE service_payments.external_service_invoice_id = ExternalServiceInvoice.id
                            )
                        )`),
                        'balance'
                    ]
                ]
            },
            include: [
                { model: Party, as: 'party' },
                {
                    model: ExternalServiceInvoiceItem,
                    as: 'items',
                    include: [
                        { model: ServiceType, as: 'service_type' },
                        { model: ExternalServiceInvoiceItemTax, as: 'taxes' }
                    ]
                }
            ],
            order: [['invoice_date', 'ASC']]
        });
    },

    /**
     * Create a new draft invoice with items and taxes
     */
    create: async (data) => {
        const t = await sequelize.transaction();
        try {
            // Validate required fields
            if (!data.job_order_id) throw new Error("Job Order ID is required");
            if (!data.party_id) throw new Error("Party ID is required");
            if (!data.invoice_date) throw new Error("Invoice Date is required");

            // Create invoice header
            const invoice = await ExternalServiceInvoice.create({
                job_order_id: data.job_order_id,
                party_id: data.party_id,
                invoice_no: data.invoice_no || null,
                invoice_date: data.invoice_date,
                status: 'Draft',
                notes: data.notes || null,
                sub_total: 0,
                tax_total: 0,
                total_amount: 0
            }, { transaction: t });

            // Create items if provided
            if (data.items && data.items.length > 0) {
                let subTotal = 0;
                let taxTotal = 0;

                for (const item of data.items) {
                    const quantity = Number(item.quantity || 1);
                    const unitPrice = Number(item.unit_price);
                    const lineTotal = quantity * unitPrice;
                    subTotal += lineTotal;

                    const invoiceItem = await ExternalServiceInvoiceItem.create({
                        invoice_id: invoice.id,
                        service_type_id: item.service_type_id,
                        description: item.description || null,
                        quantity: quantity,
                        unit_price: unitPrice,
                        line_total: lineTotal
                    }, { transaction: t });

                    // Create taxes for this item
                    if (item.taxes && item.taxes.length > 0) {
                        for (const tax of item.taxes) {
                            const taxAmount = lineTotal * Number(tax.tax_rate);
                            taxTotal += taxAmount;

                            await ExternalServiceInvoiceItemTax.create({
                                invoice_item_id: invoiceItem.id,
                                tax_name: tax.tax_name,
                                tax_rate: Number(tax.tax_rate),
                                tax_amount: taxAmount
                            }, { transaction: t });
                        }
                    }
                }

                // Update totals
                await invoice.update({
                    sub_total: subTotal,
                    tax_total: taxTotal,
                    total_amount: subTotal + taxTotal
                }, { transaction: t });
            }

            await t.commit();
            return await ExternalServiceInvoicesService.getById(invoice.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    /**
     * Update a draft invoice
     */
    update: async (id, data) => {
        const t = await sequelize.transaction();
        try {
            const invoice = await ExternalServiceInvoice.findByPk(id, { transaction: t });
            if (!invoice) throw new Error("Invoice not found");
            if (invoice.status !== 'Draft') throw new Error("Cannot edit a posted or cancelled invoice");

            // Update header fields
            await invoice.update({
                job_order_id: data.job_order_id || invoice.job_order_id,
                party_id: data.party_id || invoice.party_id,
                invoice_no: data.invoice_no !== undefined ? data.invoice_no : invoice.invoice_no,
                invoice_date: data.invoice_date || invoice.invoice_date,
                notes: data.notes !== undefined ? data.notes : invoice.notes
            }, { transaction: t });

            // If items are provided, replace them
            if (data.items) {
                // Delete existing items (cascade deletes taxes)
                await ExternalServiceInvoiceItem.destroy({
                    where: { invoice_id: id },
                    transaction: t
                });

                let subTotal = 0;
                let taxTotal = 0;

                for (const item of data.items) {
                    const quantity = Number(item.quantity || 1);
                    const unitPrice = Number(item.unit_price);
                    const lineTotal = quantity * unitPrice;
                    subTotal += lineTotal;

                    const invoiceItem = await ExternalServiceInvoiceItem.create({
                        invoice_id: invoice.id,
                        service_type_id: item.service_type_id,
                        description: item.description || null,
                        quantity: quantity,
                        unit_price: unitPrice,
                        line_total: lineTotal
                    }, { transaction: t });

                    if (item.taxes && item.taxes.length > 0) {
                        for (const tax of item.taxes) {
                            const taxAmount = lineTotal * Number(tax.tax_rate);
                            taxTotal += taxAmount;

                            await ExternalServiceInvoiceItemTax.create({
                                invoice_item_id: invoiceItem.id,
                                tax_name: tax.tax_name,
                                tax_rate: Number(tax.tax_rate),
                                tax_amount: taxAmount
                            }, { transaction: t });
                        }
                    }
                }

                await invoice.update({
                    sub_total: subTotal,
                    tax_total: taxTotal,
                    total_amount: subTotal + taxTotal
                }, { transaction: t });
            }

            await t.commit();
            return await ExternalServiceInvoicesService.getById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    /**
     * Delete a draft invoice
     */
    remove: async (id) => {
        const invoice = await ExternalServiceInvoice.findByPk(id);
        if (!invoice) throw new Error("Invoice not found");
        if (invoice.status !== 'Draft') throw new Error("Cannot delete a posted or cancelled invoice");

        await invoice.destroy();
        return { message: "Invoice deleted successfully" };
    },

    /**
     * Post an invoice - Create journal entry and load cost to job order
     */
    post: async (id, userId) => {
        const t = await sequelize.transaction();
        try {
            const invoice = await ExternalServiceInvoice.findByPk(id, {
                include: [
                    { model: Party, as: 'party' },
                    {
                        model: ExternalServiceInvoiceItem,
                        as: 'items',
                        include: [{ model: ServiceType, as: 'service_type' }]
                    }
                ],
                transaction: t
            });

            if (!invoice) throw new Error("Invoice not found");
            if (invoice.status === 'Posted') throw new Error("Invoice is already posted");
            if (invoice.status === 'Cancelled') throw new Error("Cannot post a cancelled invoice");
            if (!invoice.items || invoice.items.length === 0) throw new Error("Cannot post an invoice without items");

            // Get or create reference type
            let refType = await ReferenceType.findOne({
                where: { code: 'service_invoice' },
                transaction: t
            });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'service_invoice',
                    label: 'فاتورة خدمة',
                    name: 'فاتورة خدمة',
                    description: 'Service Invoice for External Job Order'
                }, { transaction: t });
            }

            // Create Journal Entry
            // Dr: WIP Account (109)
            // Cr: Supplier Account (from party.account_id)
            const wipServicesAccountId = 128; // WIP - Services
            const party = await Party.findByPk(invoice.party_id, { transaction: t });
            const supplierAccountId = party?.account_id;

            if (!supplierAccountId) {
                throw new Error("Supplier has no linked account");
            }

            const je = await JournalEntry.create({
                entry_type_id: 13, // Production/Manufacturing
                reference_type_id: refType.id,
                reference_id: invoice.id,
                date: invoice.invoice_date,
                description: `فاتورة خدمة #${invoice.invoice_no || invoice.id} - أمر تشغيل #${invoice.job_order_id}`,
                status: 'posted'
            }, { transaction: t });

            const totalAmount = Number(invoice.total_amount);

            await JournalEntryLine.bulkCreate([
                {
                    journal_entry_id: je.id,
                    account_id: wipServicesAccountId,
                    debit: totalAmount,
                    credit: 0,
                    description: `خدمات أمر تشغيل #${invoice.job_order_id}`
                },
                {
                    journal_entry_id: je.id,
                    account_id: supplierAccountId,
                    debit: 0,
                    credit: totalAmount,
                    description: `مستحق لـ ${party.name}`
                }
            ], { transaction: t });

            // Create cost transaction for job order
            await JobOrderCostTransaction.create({
                job_order_id: invoice.job_order_id,
                invoice_id: invoice.id,
                cost_type: 'Service',
                amount: totalAmount,
                transaction_date: new Date(),
                notes: `فاتورة خدمة #${invoice.invoice_no || invoice.id}`
            }, { transaction: t });

            // Update invoice status
            await invoice.update({
                status: 'Posted',
                journal_entry_id: je.id,
                posted_at: new Date(),
                posted_by: userId || null
            }, { transaction: t });

            await t.commit();
            return await ExternalServiceInvoicesService.getById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    /**
     * Cancel a posted invoice - Create reverse journal entry
     */
    cancel: async (id, userId) => {
        const t = await sequelize.transaction();
        try {
            const invoice = await ExternalServiceInvoice.findByPk(id, {
                include: [{ model: Party, as: 'party' }],
                transaction: t
            });

            if (!invoice) throw new Error("Invoice not found");
            if (invoice.status === 'Cancelled') throw new Error("Invoice is already cancelled");

            if (invoice.status === 'Posted') {
                // Prevent cancellation if there are payments
                const paymentsCount = await sequelize.query(`
                    SELECT COUNT(*) as count 
                    FROM service_payments 
                    WHERE external_service_invoice_id = ${id}
                `, { type: sequelize.QueryTypes.SELECT, transaction: t });

                if (paymentsCount[0].count > 0) {
                    throw new Error("Cannot cancel invoice because it has recorded payments. Please delete the payments first.");
                }

                // Create reverse journal entry
                let refType = await ReferenceType.findOne({
                    where: { code: 'service_invoice_cancel' },
                    transaction: t
                });
                if (!refType) {
                    refType = await ReferenceType.create({
                        code: 'service_invoice_cancel',
                        label: 'إلغاء فاتورة خدمة',
                        name: 'إلغاء فاتورة خدمة',
                        description: 'Cancelled Service Invoice'
                    }, { transaction: t });
                }

                const wipServicesAccountId = 128; // WIP - Services
                const party = await Party.findByPk(invoice.party_id, { transaction: t });
                const supplierAccountId = party?.account_id;

                const je = await JournalEntry.create({
                    entry_type_id: 13,
                    reference_type_id: refType.id,
                    reference_id: invoice.id,
                    date: new Date(),
                    description: `إلغاء فاتورة خدمة #${invoice.invoice_no || invoice.id}`,
                    status: 'posted'
                }, { transaction: t });

                const totalAmount = Number(invoice.total_amount);

                await JournalEntryLine.bulkCreate([
                    {
                        journal_entry_id: je.id,
                        account_id: supplierAccountId,
                        debit: totalAmount,
                        credit: 0,
                        description: `إلغاء مستحق لـ ${party.name}`
                    },
                    {
                        journal_entry_id: je.id,
                        account_id: wipServicesAccountId,
                        debit: 0,
                        credit: totalAmount,
                        description: `إلغاء خدمات أمر تشغيل #${invoice.job_order_id}`
                    }
                ], { transaction: t });

                // Create negative cost transaction
                await JobOrderCostTransaction.create({
                    job_order_id: invoice.job_order_id,
                    invoice_id: invoice.id,
                    cost_type: 'Service',
                    amount: -totalAmount,
                    transaction_date: new Date(),
                    notes: `إلغاء فاتورة خدمة #${invoice.invoice_no || invoice.id}`
                }, { transaction: t });
            }

            await invoice.update({
                status: 'Cancelled'
            }, { transaction: t });

            await t.commit();
            return await ExternalServiceInvoicesService.getById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
};

export default ExternalServiceInvoicesService;
