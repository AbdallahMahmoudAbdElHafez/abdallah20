import employeesService from "../services/employees.service.js";

class EmployeesController {
  async getAll(req, res) {
    const data = await employeesService.getAll();
    res.json(data);
  }

  async getById(req, res) {
    const id = req.params.id;
    const result = await employeesService.getById(id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  }

  async create(req, res) {
    const emp = await employeesService.create(req.body);
    res.json(emp);
  }

  async update(req, res) {
    const id = req.params.id;
    const emp = await employeesService.update(id, req.body);
    if (!emp) return res.status(404).json({ message: "Not found" });
    res.json(emp);
  }

  async delete(req, res) {
    const id = req.params.id;
    const deleted = await employeesService.delete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  }
}

export default new EmployeesController();
