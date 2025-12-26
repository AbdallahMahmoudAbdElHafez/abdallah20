import { ServicePayment, JournalEntry, JournalEntryLine, Party, Account, Cheque, sequelize } from '../models/index.js';

const ServicePaymentsService = {
    getAll: async (filters = {}) => {
        const where = {};
        if (filters.external_job_order_id) where.external_job_order_id = filters.external_job_order_id;
        if (filters.party_id) where.party_id = filters.party_id;

        // Date range filtering
        if (filters.startDate && filters.endDate) {
            where.payment_date = {
                [sequelize.Sequelize.Op.between]: [filters.startDate, filters.endDate]
            };
        } else if (filters.startDate) {
            where.payment_date = {
                [sequelize.Sequelize.Op.gte]: filters.startDate
            };
        } else if (filters.endDate) {
            where.payment_date = {
                [sequelize.Sequelize.Op.lte]: filters.endDate
            };
        }

        return await ServicePayment.findAll({
            where,
            include: [
                { model: Party, as: 'party' },
                { model: Account, as: 'account' }
            ],
            order: [['payment_date', 'DESC']]
        });
    },

    getById: async (id) => {
        return await ServicePayment.findByPk(id, {
            include: [
                { model: Party, as: 'party' },
                { model: Account, as: 'account' }
            ]
        });
    },

    create: async (data) => {
        const t = await sequelize.transaction();
        try {
            if (data.payment_date === '') data.payment_date = new Date();

            const payment = await ServicePayment.create(data, { transaction: t });

            // Create Journal Entry
            // Debit: Supplier (Liability decrease)
            // Credit: Bank/Cash (Asset decrease)

            const supplier = await Party.findByPk(data.party_id, { transaction: t });
            if (!supplier || !supplier.account_id) throw new Error("Supplier account not found");

            const je = await JournalEntry.create({
                entry_type_id: 1, // Default type
                reference_type_id: 1, // Placeholder for ServicePayment reference type
                reference_id: payment.id,
                date: data.payment_date,
                description: `دفعة خدمة - ${supplier.name} - ${data.note || ''}`,
                status: 'posted'
            }, { transaction: t });

            await JournalEntryLine.bulkCreate([
                {
                    journal_entry_id: je.id,
                    account_id: supplier.account_id, // Debit Supplier
                    debit: data.amount,
                    credit: 0,
                    description: `دفعة خدمة - ${supplier.name}`
                },
                {
                    journal_entry_id: je.id,
                    account_id: data.account_id, // Credit Bank/Cash
                    debit: 0,
                    credit: data.amount,
                    description: `دفعة خدمة - ${supplier.name}`
                }
            ], { transaction: t });

            // Handle Cheque Creation
            if (data.payment_method === 'cheque') {
                if (!data.cheque_number || !data.due_date) {
                    throw new Error("Cheque number and Due Date are required for cheque payments");
                }

                await Cheque.create({
                    cheque_number: data.cheque_number,
                    cheque_type: 'outgoing', // Service payment is outgoing
                    account_id: data.account_id,
                    issue_date: data.issue_date || data.payment_date,
                    due_date: data.due_date,
                    amount: data.amount,
                    status: 'issued',
                    service_payment_id: payment.id
                }, { transaction: t });
            }

            await t.commit();

            return payment;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    update: async (id, data) => {
        const item = await ServicePayment.findByPk(id);
        if (!item) return null;
        return await item.update(data);
    },

    remove: async (id) => {
        const item = await ServicePayment.findByPk(id);
        if (!item) return null;
        await item.destroy();
        return { message: 'Deleted successfully' };
    }
};

export default ServicePaymentsService;
