// src/services/processes.service.js
import { Process } from "../models/index.js";

const ProcessService = {
  getAll: async () => {
    return await Process.findAll();
  },

  getById: async (id) => {
    return await Process.findByPk(id);
  },

  create: async (data) => {
    return await Process.create(data);
  },

  update: async (id, data) => {
    const process = await Process.findByPk(id);
    if (!process) return null;
    return await process.update(data);
  },

  remove: async (id) => {
    const process = await Process.findByPk(id);
    if (!process) return null;
    await process.destroy();
    return { message: 'Process deleted successfully' };
  },
};

export default ProcessService;
