import { ServicePayment, JournalEntry, JournalEntryLine, Party, Account, Cheque, sequelize, ReferenceType, Employee, ExternalJobOrder } from '../models/index.js';

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
                { model: Account, as: 'account' },
                { model: Account, as: 'credit_account' },
                { model: Employee, as: 'employee' }
            ],
            order: [['payment_date', 'DESC']]
        });
    },

    getById: async (id) => {
        return await ServicePayment.findByPk(id, {
            include: [
                { model: Party, as: 'party' },
                { model: Account, as: 'account' },
                { model: Account, as: 'credit_account' },
                { model: Employee, as: 'employee' }
            ]
        });
    },

    create: async (data) => {
        const t = await sequelize.transaction();
        try {
            if (data.payment_date === '') data.payment_date = new Date();
            if (data.external_service_id === '') data.external_service_id = null;
            if (data.employee_id === '') data.employee_id = null;

            const supplier = await Party.findByPk(data.party_id, { transaction: t });
            if (!supplier) throw new Error("Party not found");

            // --- STRICT ACCOUNTING LOGIC ---
            const debitAccount = await Account.findByPk(data.account_id, { transaction: t });
            if (!debitAccount) throw new Error("Debit Account not found");

            // 1. Prohibit direct WIP inflation
            if (debitAccount.id === 109) {
                throw new Error("Accounting Rule: Service Payments cannot debit WIP (109) directly. Please record a 'Service Invoice' first to recognize the cost, then use this screen to record the cash payment against the Supplier.");
            }

            // 2. Enforce Liability Debit (Settlement)
            if (debitAccount.account_type !== 'liability') {
                throw new Error("Invalid Account: Service payments must debit a Liability account (e.g., Suppliers) to settle an existing debt.");
            }
            // ------------------------------------

            const payment = await ServicePayment.create(data, { transaction: t });

            let refType = await ReferenceType.findOne({ where: { code: 'service_payment' }, transaction: t });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'service_payment',
                    label: 'سداد خدمات',
                    name: 'سداد خدمات',
                    description: 'Journal Entry for Service Payment (Settlement)'
                }, { transaction: t });
            }

            const je = await JournalEntry.create({
                entry_type_id: 1, // Default type
                reference_type_id: refType.id,
                reference_id: payment.id,
                date: data.payment_date,
                description: `سداد مديونية (خدمات) - ${supplier.name} - ${data.note || ''}`,
                status: 'posted'
            }, { transaction: t });

            await JournalEntryLine.bulkCreate([
                {
                    journal_entry_id: je.id,
                    account_id: data.account_id, // Debit Supplier (Reduction of liability)
                    debit: data.amount,
                    credit: 0,
                    description: `سداد مستحقات للمورد ${supplier.name}`
                },
                {
                    journal_entry_id: je.id,
                    account_id: data.credit_account_id, // Credit Bank/Cash
                    debit: 0,
                    credit: data.amount,
                    description: `سداد مديونية (خدمات) - ${supplier.name}`
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
                    account_id: data.credit_account_id, // Source account (Bank)
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
        if (data.external_job_order_id === '') data.external_job_order_id = null;
        if (data.employee_id === '') data.employee_id = null;

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
