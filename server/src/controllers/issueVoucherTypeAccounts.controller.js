import service from "../services/issueVoucherTypeAccounts.service.js";
import Joi from "joi";

const schema = Joi.object({
  issue_voucher_type_id: Joi.number().integer().required(),
  account_id: Joi.number().integer().required(),
});

class IssueVoucherTypeAccountsController {
  async getAll(req, res) {
    const data = await service.findAll();
    res.json(data);
  }

  async getById(req, res) {
    const row = await service.findById(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  }

  async getByType(req, res) {
    const rows = await service.findByType(req.params.typeId);
    res.json(rows);
  }

  async create(req, res) {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json(error);

    const row = await service.create(value);
    res.status(201).json(row);
  }

  async bulkCreate(req, res) {
    if (!Array.isArray(req.body))
      return res.status(400).json({ message: "Body must be array" });

    for (const item of req.body) {
      const { error } = schema.validate(item);
      if (error) return res.status(400).json(error);
    }

    const rows = await service.bulkCreate(req.body);
    res.status(201).json(rows);
  }

  async update(req, res) {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json(error);

    await service.update(req.params.id, value);
    res.json({ message: "Updated" });
  }

  async delete(req, res) {
    await service.delete(req.params.id);
    res.json({ message: "Deleted" });
  }
}

export default new IssueVoucherTypeAccountsController();
