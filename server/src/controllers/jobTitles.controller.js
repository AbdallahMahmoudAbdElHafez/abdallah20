import jobTitlesService from "../services/jobTitles.service.js";

class JobTitlesController {
  async getAll(req, res) {
    const list = await jobTitlesService.getAll();
    res.json(list);
  }

  async getById(req, res) {
    const item = await jobTitlesService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }

  async create(req, res) {
    const item = await jobTitlesService.create(req.body);
    res.status(201).json(item);
  }

  async update(req, res) {
    const updated = await jobTitlesService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  }

  async delete(req, res) {
    const deleted = await jobTitlesService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  }
}

export default new JobTitlesController();
