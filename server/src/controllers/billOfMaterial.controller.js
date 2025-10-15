// src/controllers/billOfMaterial.controller.js
import Joi from 'joi';
import * as service from '../services/billOfMaterial.service.js';

const createSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  material_id: Joi.number().integer().required(),
  quantity_per_unit: Joi.number().precision(3).required(),
  unit: Joi.string().max(20).allow(null,'')
});

export const create = async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const bom = await service.createBOM(value);
    return res.status(201).json(bom);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};

export const list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.product_id) filter.product_id = Number(req.query.product_id);
    if (req.query.material_id) filter.material_id = Number(req.query.material_id);
    const rows = await service.getAllBOM(filter);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await service.getBOMById(id);
    if (!row) return res.status(404).json({ error: 'not found' });
    return res.json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};

export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const updated = await service.updateBOM(id, value);
    if (!updated) return res.status(404).json({ error: 'not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};

export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.deleteBOM(id);
    if (!deleted) return res.status(404).json({ error: 'not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};
