// src/services/jobOrderCosts.service.js
import { JobOrderCost } from "../models/index.js";

const JobOrderCostsService = {
    getAll: async () => {
        return await JobOrderCost.findAll();
    },

    getByJobOrderId: async (jobOrderId) => {
        return await JobOrderCost.findAll({
            where: { job_order_id: jobOrderId },
        });
    },

    getById: async (id) => {
        return await JobOrderCost.findByPk(id);
    },

    create: async (data) => {
        return await JobOrderCost.create(data);
    },

    update: async (id, data) => {
        const cost = await JobOrderCost.findByPk(id);
        if (!cost) return null;
        return await cost.update(data);
    },

    remove: async (id) => {
        const cost = await JobOrderCost.findByPk(id);
        if (!cost) return null;
        await cost.destroy();
        return { message: 'Cost deleted successfully' };
    },
};

export default JobOrderCostsService;
