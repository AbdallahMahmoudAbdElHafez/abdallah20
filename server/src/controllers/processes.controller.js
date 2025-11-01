// src/controllers/processes.controller.js
import ProcessService from '../services/processes.service.js';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
});

const ProcessController = {
  getAll: async (req, res) => {
    const data = await ProcessService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const process = await ProcessService.getById(req.params.id);
    if (!process) return res.status(404).json({ message: 'Process not found' });
    res.json(process);
  },

  create: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const newProcess = await ProcessService.create(value);
    res.status(201).json(newProcess);
  },

  update: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updated = await ProcessService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: 'Process not found' });
    res.json(updated);
  },

  remove: async (req, res) => {
    const deleted = await ProcessService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Process not found' });
    res.json(deleted);
  },
};

export default ProcessController;
