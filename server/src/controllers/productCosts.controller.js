// src/controllers/productCosts.controller.js
import * as productCostService from '../services/productCosts.service.js';

export const getAll = async (req, res) => {
  const data = await productCostService.getAllProductCosts();
  res.json(data);
};

export const getById = async (req, res) => {
  const data = await productCostService.getProductCostById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

export const create = async (req, res) => {
  const data = await productCostService.createProductCost(req.body);
  res.status(201).json(data);
};

export const update = async (req, res) => {
  const data = await productCostService.updateProductCost(req.params.id, req.body);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

export const remove = async (req, res) => {
  const data = await productCostService.deleteProductCost(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted successfully' });
};
