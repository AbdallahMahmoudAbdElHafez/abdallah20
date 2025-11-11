// src/controllers/externalJobOrders.controller.js
import ExternalJobOrdersService from '../services/externalJobOrders.service.js';
import Joi from 'joi';

const schema = Joi.object({
  party_id: Joi.number().integer().required(),
  product_id: Joi.number().integer().required(),
  process_id: Joi.number().integer().allow(null),
  warehouse_id: Joi.number().integer().required(),
  status: Joi.string()
    .valid('planned', 'in_progress', 'completed', 'cancelled')
    .default('planned'),
  start_date: Joi.date().allow(null),
  end_date: Joi.date().allow(null),
  order_quantity: Joi.number().precision(3).allow(null),
  produced_quantity: Joi.number().precision(3).allow(null),
  cost_estimate: Joi.number().precision(2).default(0),
  cost_actual: Joi.number().precision(2).default(0),
  reference_no: Joi.string().allow(null, ''),
});

const ExternalJobOrdersController = {
  getAll: async (req, res) => {
    const data = await ExternalJobOrdersService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const order = await ExternalJobOrdersService.getById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  },

  create: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    console.log(error);
    if (error) return res.status(400).json({ message: error.message });

    const newOrder = await ExternalJobOrdersService.create(value);
    res.status(201).json(newOrder);
  },

  update: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updated = await ExternalJobOrdersService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  },

  remove: async (req, res) => {
    const deleted = await ExternalJobOrdersService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json(deleted);
  },
};

export default ExternalJobOrdersController;
