// src/services/billOfMaterial.service.js
import {BillOfMaterial} from '../models/index.js';
import { Op } from 'sequelize';

export const createBOM = async (data) => {
  return BillOfMaterial.create(data);
};

export const getAllBOM = async (filter = {}) => {
  const where = {};
  if (filter.product_id) where.product_id = filter.product_id;
  if (filter.material_id) where.material_id = filter.material_id;
  return BillOfMaterial.findAll({ where, order: [['id','ASC']] });
};

export const getBOMById = async (id) => {
  return BillOfMaterial.findByPk(id);
};

export const updateBOM = async (id, data) => {
  const row = await BillOfMaterial.findByPk(id);
  if (!row) return null;
  return row.update(data);
};

export const deleteBOM = async (id) => {
  const row = await BillOfMaterial.findByPk(id);
  if (!row) return 0;
  await row.destroy();
  return 1;
};
