import ServicePaymentsService from '../services/servicePayments.service.js';
import Joi from 'joi';

const schema = Joi.object({
    party_id: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    payment_date: Joi.date().allow(null, ''),
    payment_method: Joi.string().valid('cash', 'bank', 'cheque', 'other').default('cash'),
    reference_number: Joi.string().allow(null, ''),
    account_id: Joi.number().integer().required(),
    credit_account_id: Joi.number().integer().required(),
    external_job_order_id: Joi.number().integer().allow(null, ''),
    employee_id: Joi.number().integer().allow(null, ''),
    note: Joi.string().allow(null, ''),
    cheque_number: Joi.string().allow(null, ''),
    issue_date: Joi.date().allow(null, ''),
    due_date: Joi.date().allow(null, '')
});

const ServicePaymentsController = {
    getAll: async (req, res) => {
        try {
            const data = await ServicePaymentsService.getAll(req.query);
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const item = await ServicePaymentsService.getById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const newItem = await ServicePaymentsService.create(value);
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const updated = await ServicePaymentsService.update(req.params.id, value);
            if (!updated) return res.status(404).json({ message: 'Not found' });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const deleted = await ServicePaymentsService.remove(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Not found' });
            res.json(deleted);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default ServicePaymentsController;
