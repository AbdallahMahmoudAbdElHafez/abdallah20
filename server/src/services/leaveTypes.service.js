import { LeaveType } from "../models/index.js";

const LeaveTypeService = {
  getAll: async () => {
    return await LeaveType.findAll({ order: [["id", "ASC"]] });
  },

  getById: async (id) => {
    return await LeaveType.findByPk(id);
  },

  create: async (data) => {
    return await LeaveType.create(data);
  },

  update: async (id, data) => {
    const leaveType = await LeaveType.findByPk(id);
    if (!leaveType) return null;
    return await leaveType.update(data);
  },

  remove: async (id) => {
    const leaveType = await LeaveType.findByPk(id);
    if (!leaveType) return null;
    await leaveType.destroy();
    return true;
  },
};

export default LeaveTypeService;
