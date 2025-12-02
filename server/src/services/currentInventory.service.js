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

  createOrUpdate: async (product_id, warehouse_id, quantityChange, options = {}) => {
    const record = await CurrentInventory.findOne({ where: { product_id, warehouse_id }, ...options });
    if (record) {
      record.quantity = Number(record.quantity) + Number(quantityChange);
      await record.save(options);
      return record;
    } else {
      return await CurrentInventory.create({ product_id, warehouse_id, quantity: quantityChange }, options);
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
