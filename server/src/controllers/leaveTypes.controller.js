import Joi from "joi";
import LeaveTypeService from "../services/leaveTypes.service.js";

const schema = Joi.object({
  name: Joi.string().max(100).required(),
  is_paid: Joi.boolean().optional(),
});

const LeaveTypeController = {
  getAll: async (req, res) => {
    const data = await LeaveTypeService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const leaveType = await LeaveTypeService.getById(req.params.id);
    if (!leaveType) return res.status(404).json({ message: "غير موجود" });
    res.json(leaveType);
  },

  create: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const created = await LeaveTypeService.create(value);
    res.status(201).json(created);
  },

  update: async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updated = await LeaveTypeService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "غير موجود" });

    res.json(updated);
  },

  remove: async (req, res) => {
    const deleted = await LeaveTypeService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "غير موجود" });
    res.json({ message: "تم الحذف" });
  },
};

export default LeaveTypeController;
