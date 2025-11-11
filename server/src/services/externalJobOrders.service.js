// src/services/externalJobOrders.service.js
import { ExternalJobOrder } from "../models/index.js";

const ExternalJobOrdersService = {
  getAll: async () => {
    return await ExternalJobOrder.findAll();
  },

  getById: async (id) => {
    return await ExternalJobOrder.findByPk(id);
  },

  create: async (data) => {
    return await ExternalJobOrder.create(data);
  },

  update: async (id, data) => {
    const order = await ExternalJobOrder.findByPk(id);
    if (!order) return null;
    return await order.update(data);
  },

  remove: async (id) => {
    const order = await ExternalJobOrder.findByPk(id);
    if (!order) return null;
    await order.destroy();
    return { message: 'Order deleted successfully' };
  },
};

export default ExternalJobOrdersService;
