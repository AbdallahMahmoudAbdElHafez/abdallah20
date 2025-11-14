import { Department } from "../models/index.js";

const DepartmentService = {
  getAll: async () => {
    return await Department.findAll({ order: [["id", "ASC"]] });
  },

  getById: async (id) => {
    return await Department.findByPk(id);
  },

  create: async (data) => {
    return await Department.create(data);
  },

  update: async (id, data) => {
    const dept = await Department.findByPk(id);
    if (!dept) return null;
    return await dept.update(data);
  },

  remove: async (id) => {
    const dept = await Department.findByPk(id);
    if (!dept) return null;
    await dept.destroy();
    return true;
  },
};

export default DepartmentService;
