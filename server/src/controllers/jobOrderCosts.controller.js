// src/controllers/jobOrderCosts.controller.js
import JobOrderCostsService from '../services/jobOrderCosts.service.js';
import Joi from 'joi';

const schema = Joi.object({
    job_order_id: Joi.number().integer().required(),
    cost_type: Joi.string()
        .valid('raw_material', 'processing', 'transport', 'other')
        .required(),
    amount: Joi.number().precision(2).required(),
    cost_per_unit: Joi.number().precision(2).allow(null, ''),
    cost_date: Joi.date().allow(null, ''),
    notes: Joi.string().allow(null, ''),
});

const JobOrderCostsController = {
    getAll: async (req, res) => {
        const data = await JobOrderCostsService.getAll();
        res.json(data);
    },

    getByJobOrderId: async (req, res) => {
        const costs = await JobOrderCostsService.getByJobOrderId(req.params.jobOrderId);
        res.json(costs);
    },

    getById: async (req, res) => {
        const cost = await JobOrderCostsService.getById(req.params.id);
        if (!cost) return res.status(404).json({ message: 'Cost not found' });
        res.json(cost);
    },

    create: async (req, res) => {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const newCost = await JobOrderCostsService.create(value);
        res.status(201).json(newCost);
    },

    update: async (req, res) => {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const updated = await JobOrderCostsService.update(req.params.id, value);
        if (!updated) return res.status(404).json({ message: 'Cost not found' });
        res.json(updated);
    },

    remove: async (req, res) => {
        const deleted = await JobOrderCostsService.remove(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Cost not found' });
        res.json(deleted);
    },
};

export default JobOrderCostsController;
