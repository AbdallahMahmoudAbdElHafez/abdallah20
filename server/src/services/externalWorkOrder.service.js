import db from '../db.js';
const ExternalWorkOrder = db.models.ExternalWorkOrder;

export const getAll = async () => {
  return await ExternalWorkOrder.findAll();
};

export const getById = async (id) => {
  return await ExternalWorkOrder.findByPk(id);
};

export const create = async (data) => {
  return await ExternalWorkOrder.create(data);
};

export const update = async (id, data) => {
  const order = await ExternalWorkOrder.findByPk(id);
  if (!order) throw new Error('Work order not found');
  await order.update(data);
  return order;
};

export const remove = async (id) => {
  const order = await ExternalWorkOrder.findByPk(id);
  if (!order) throw new Error('Work order not found');
  await order.destroy();
  return true;
};
