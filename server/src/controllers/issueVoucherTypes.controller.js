import service from "../services/issueVoucherTypes.service.js";

class IssueVoucherTypesController {
  async getAll(req, res) {
    const data = await service.getAll();
    res.json(data);
  }

  async getById(req, res) {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }

  async create(req, res) {
    try {
      const item = await service.create(req.body);
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    const item = await service.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }

  async delete(req, res) {
    const success = await service.delete(req.params.id);
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  }
}

export default new IssueVoucherTypesController();
