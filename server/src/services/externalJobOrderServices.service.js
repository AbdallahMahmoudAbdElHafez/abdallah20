import { ExternalJobOrderService, Party, ExternalJobOrder, sequelize, ReferenceType } from '../models/index.js';
import { createJournalEntry } from './journal.service.js';

const ExternalJobOrderServicesService = {
    getAll: async (filters = {}) => {
        const where = {};
        if (filters.job_order_id) where.job_order_id = filters.job_order_id;
        if (filters.party_id) where.party_id = filters.party_id;

        return await ExternalJobOrderService.findAll({
            where,
            include: [
                { model: ExternalJobOrder, as: 'job_order' },
                { model: Party, as: 'party' }
            ],
            order: [['service_date', 'DESC']]
        });
    },

    getById: async (id) => {
        return await ExternalJobOrderService.findByPk(id, {
            include: [
                { model: ExternalJobOrder, as: 'job_order' },
                { model: Party, as: 'party' }
            ]
        });
    },

    create: async (data) => {
        const t = await sequelize.transaction();
        try {
            const supplier = await Party.findByPk(data.party_id, { transaction: t });
            if (!supplier) throw new Error("Supplier not found");
            if (!supplier.account_id) throw new Error("Supplier has no linked account for liability");

            const jobOrder = await ExternalJobOrder.findByPk(data.job_order_id, { transaction: t });
            if (!jobOrder) throw new Error("Job Order not found");

            const service = await ExternalJobOrderService.create(data, { transaction: t });

            // Ensure Reference Type exists
            let refType = await ReferenceType.findOne({ where: { code: 'job_order_service_accrual' }, transaction: t });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'job_order_service_accrual',
                    label: 'استحقاق تشغيل خارجي',
                    name: 'استحقاق تشغيل خارجي',
                    description: 'Accrual of external manufacturing services'
                }, { transaction: t });
            }

            // Journal Entry: Dr WIP (109) / Cr Supplier (Liability Account)
            const WIP_ACCOUNT_ID = 128; // WIP - External Services
            await createJournalEntry({
                refCode: 'job_order_service_accrual',
                refId: service.id,
                entryDate: service.service_date,
                description: `استحقاق خدمات تشغيل خارجي - أمر #${jobOrder.job_order_number || jobOrder.id} - ${supplier.name}`,
                lines: [
                    {
                        account_id: WIP_ACCOUNT_ID,
                        debit: service.amount,
                        credit: 0,
                        description: `إثبات تكلفة خدمة تشغيل (أمر #${jobOrder.job_order_number || jobOrder.id})`
                    },
                    {
                        account_id: supplier.account_id,
                        debit: 0,
                        credit: service.amount,
                        description: `استحقاق للمورد ${supplier.name}`
                    }
                ]
            }, { transaction: t });

            await t.commit();
            return service;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    remove: async (id) => {
        // Strict accounting usually prevents simple deletion, but supporting it for now if unpaid
        const t = await sequelize.transaction();
        try {
            const service = await ExternalJobOrderService.findByPk(id, { transaction: t });
            if (!service) throw new Error("Service not found");
            if (service.status !== 'unpaid') throw new Error("Cannot delete a paid or partially paid service invoice");

            // Deletion should also remove the journal entry
            // (Assuming standard cleanup logic or manual reversal)
            await service.destroy({ transaction: t });
            await t.commit();
            return { message: "Service deleted" };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
};

export default ExternalJobOrderServicesService;
