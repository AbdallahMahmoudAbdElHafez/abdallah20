import ExternalJobOrderServicesService from '../services/externalJobOrderServices.service.js';
import Joi from 'joi';

const schema = Joi.object({
    job_order_id: Joi.number().integer().required(),
    party_id: Joi.number().integer().required(),
    service_date: Joi.date().allow(null, ''),
    amount: Joi.number().positive().required(),
    note: Joi.string().allow(null, '')
});

const ExternalJobOrderServicesController = {
    getAll: async (req, res) => {
        try {
            const data = await ExternalJobOrderServicesService.getAll(req.query);
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const newItem = await ExternalJobOrderServicesService.create(value);
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const result = await ExternalJobOrderServicesService.remove(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default ExternalJobOrderServicesController;
