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
  start_date: Joi.date().allow(null, ''),
  end_date: Joi.date().allow(null, ''),
  order_quantity: Joi.number().precision(3).allow(null),
  produced_quantity: Joi.number().precision(3).allow(null),
  estimated_processing_cost_per_unit: Joi.number().precision(2).allow(null, '').default(0),
  actual_processing_cost_per_unit: Joi.number().precision(2).allow(null, '').default(0),
  estimated_raw_material_cost_per_unit: Joi.number().precision(2).allow(null, '').default(0),
  actual_raw_material_cost_per_unit: Joi.number().precision(2).allow(null, '').default(0),
  total_estimated_cost: Joi.number().precision(2).allow(null, '').default(0),
  total_actual_cost: Joi.number().precision(2).allow(null, '').default(0),
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

  calculateCost: async (req, res) => {
    try {
      const { product_id, warehouse_id, order_quantity } = req.query;

      // Validate required parameters
      if (!product_id || !warehouse_id || !order_quantity) {
        return res.status(400).json({
          message: 'Missing required parameters: product_id, warehouse_id, order_quantity'
        });
      }

      const result = await ExternalJobOrdersService.calculateRawMaterialCost(
        parseInt(product_id),
        parseInt(warehouse_id),
        parseFloat(order_quantity)
      );

      res.json(result);
    } catch (error) {
      console.error('Error calculating cost:', error);
      res.status(500).json({
        message: 'Error calculating cost',
        error: error.message
      });
    }
  },

  sendMaterials: async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items array is required' });
      }
      const result = await ExternalJobOrdersService.sendMaterials(req.params.id, items);
      res.json(result);
    } catch (error) {
      console.error('Error sending materials:', error);
      res.status(500).json({ message: error.message });
    }
  },

  receiveFinishedGoods: async (req, res) => {
    try {
      const result = await ExternalJobOrdersService.receiveFinishedGoods(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error('Error receiving goods:', error);
      res.status(500).json({ message: error.message });
    }
  },
};

export default ExternalJobOrdersController;
