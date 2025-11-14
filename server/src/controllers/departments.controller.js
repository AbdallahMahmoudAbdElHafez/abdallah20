import Joi from "joi";
import DepartmentService from "../services/departments.service.js";

const schema = Joi.object({
  name: Joi.string().max(150).required(),
});

const DepartmentController = {
  getAll: async (req, res) => {
    const data = await DepartmentService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const dept = await DepartmentService.getById(req.params.id);
    if (!dept) return res.status(404).json({ message: "غير موجود" });
    res.json(dept);
  },

  create: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const created = await DepartmentService.create(value);
    res.status(201).json(created);
  },

  update: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updated = await DepartmentService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "غير موجود" });

    res.json(updated);
  },

  remove: async (req, res) => {
    const deleted = await DepartmentService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "غير موجود" });
    res.json({ message: "تم الحذف" });
  },
};

export default DepartmentController;
