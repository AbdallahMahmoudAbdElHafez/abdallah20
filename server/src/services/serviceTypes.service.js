// src/services/serviceTypes.service.js
import { ServiceType, Account } from "../models/index.js";

const ServiceTypesService = {
    getAll: async () => {
        return await ServiceType.findAll({
            include: [{ model: Account, as: 'account' }],
            order: [['name', 'ASC']]
        });
    },

    getById: async (id) => {
        return await ServiceType.findByPk(id, {
            include: [{ model: Account, as: 'account' }]
        });
    },

    create: async (data) => {
        return await ServiceType.create({
            name: data.name,
            account_id: data.account_id || null,
            affects_job_cost: data.affects_job_cost !== false
        });
    },

    update: async (id, data) => {
        const serviceType = await ServiceType.findByPk(id);
        if (!serviceType) return null;
        return await serviceType.update(data);
    },

    remove: async (id) => {
        const serviceType = await ServiceType.findByPk(id);
        if (!serviceType) return null;
        await serviceType.destroy();
        return { message: "Service type deleted successfully" };
    }
};

export default ServiceTypesService;
