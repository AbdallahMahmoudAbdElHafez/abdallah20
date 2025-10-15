import * as service from '../services/externalWorkOrder.service.js';

export const getAll = async (req, res) => {
  const data = await service.getAll();
  res.json(data);
};

export const getById = async (req, res) => {
  const data = await service.getById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

export const create = async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json(data);
};

export const update = async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  res.json(data);
};

export const remove = async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).end();
};
