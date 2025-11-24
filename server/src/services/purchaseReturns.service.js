import { PurchaseReturn } from "../models/index.js";

export default {
  getAll: async () => {
    return await PurchaseReturn.findAll({ include: ["supplier", "invoice", "warehouse"] });
  },

  getById: async (id) => {
    return await PurchaseReturn.findByPk(id, { include: ["supplier", "invoice", "warehouse"] });
  },

  create: async (data) => {
    return await PurchaseReturn.create(data);
  },

  update: async (id, data) => {
    const row = await PurchaseReturn.findByPk(id);
    if (!row) return null;
    return await row.update(data);
  },

  delete: async (id) => {
    const row = await PurchaseReturn.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return true;
  }
};
