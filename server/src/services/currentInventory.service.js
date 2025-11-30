import { CurrentInventory, Product, Warehouse } from "../models/index.js";

const CurrentInventoryService = {
  getAll: async () => {
    return await CurrentInventory.findAll({
      include: [
        { model: Product, as: "product", attributes: ["id", "name"] },
        { model: Warehouse, as: "warehouse", attributes: ["id", "name"] },
      ],
    });
  },

  getById: async (id) => {
    return await CurrentInventory.findByPk(id);
  },

  getByProductAndWarehouse: async (product_id, warehouse_id) => {
    return await CurrentInventory.findOne({ where: { product_id, warehouse_id } });
  },

  createOrUpdate: async (product_id, warehouse_id, quantityChange) => {
    const record = await CurrentInventory.findOne({ where: { product_id, warehouse_id } });
    if (record) {
      record.quantity += quantityChange;
      await record.save();
      return record;
    } else {
      return await CurrentInventory.create({ product_id, warehouse_id, quantity: quantityChange });
    }
  },

  update: async (id, data) => {
    const record = await CurrentInventory.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  },

  remove: async (id) => {
    const record = await CurrentInventory.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return { message: "تم الحذف بنجاح" };
  },
};

export default CurrentInventoryService;
