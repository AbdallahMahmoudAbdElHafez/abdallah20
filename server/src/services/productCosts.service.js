// src/services/productCosts.service.js
import { Product, ProductCost } from "../models/index.js";

export const getAllProductCosts = async () => {
  return await ProductCost.findAll({
    include: [{ model: Product, attributes: ['id', 'name'],as: 'product' }],
    order: [['start_date', 'DESC']],
  });
};

export const getProductCostById = async (id) => {
  return await ProductCost.findByPk(id);
};

export const createProductCost = async (data) => {
  return await ProductCost.create(data);
};

export const updateProductCost = async (id, data) => {
  const cost = await ProductCost.findByPk(id);
  if (!cost) return null;
  await cost.update(data);
  return cost;
};

export const deleteProductCost = async (id) => {
  const cost = await ProductCost.findByPk(id);
  if (!cost) return null;
  await cost.destroy();
  return cost;
};
