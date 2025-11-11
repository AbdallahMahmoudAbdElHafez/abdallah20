import Joi from "joi";
import CurrentInventoryService from "../services/currentInventory.service.js";

const schema = Joi.object({
  product_id: Joi.number().integer().required(),
  warehouse_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().required(),
});

const CurrentInventoryController = {
  getAll: async (req, res) => {
    const data = await CurrentInventoryService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const record = await CurrentInventoryService.getById(req.params.id);
    if (!record) return res.status(404).json({ message: "السجل غير موجود" });
    res.json(record);
  },

  createOrUpdate: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { product_id, warehouse_id, quantity } = value;
    const result = await CurrentInventoryService.createOrUpdate(product_id, warehouse_id, quantity);
    res.status(201).json(result);
  },

  update: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updated = await CurrentInventoryService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "السجل غير موجود" });
    res.json(updated);
  },

  remove: async (req, res) => {
    const deleted = await CurrentInventoryService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "السجل غير موجود" });
    res.json(deleted);
  },
};

export default CurrentInventoryController;
