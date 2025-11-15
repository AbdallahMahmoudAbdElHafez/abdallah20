import { Employee } from "../models/index.js";

class EmployeesService {
 static async getAll() {
    return Employee.findAll({
      include: ["job_title", "department", "parent_employee"],
    });
  }

 static async getById(id) {
    return Employee.findByPk(id, {
      include: ["job_title", "department", "parent_employee"],
    });
  }

static  async create(data) {
    return Employee.create(data);
  }

 static async update(id, data) {
    const emp = await Employee.findByPk(id);
    if (!emp) return null;
    await emp.update(data);
    return emp;
  }

 static async delete(id) {
    const emp = await Employee.findByPk(id);
    if (!emp) return null;
    await emp.destroy();
    return true;
  }
}

export default  EmployeesService;
