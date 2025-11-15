import {JobTitle} from "../models/index.js";

class JobTitlesService {
 static async getAll() {
    return JobTitle.findAll();
  }

 static async getById(id) {
    return JobTitle.findByPk(id);
  }

 static async create(data) {
    return JobTitle.create(data);
  }

 static async update(id, data) {
    const record = await JobTitle.findByPk(id);
    if (!record) return null;

    await record.update(data);
    return record;
  }

  static async delete(id) {
    const record = await JobTitle.findByPk(id);
    if (!record) return null;

    await record.destroy();
    return true;
  }
}

export default  JobTitlesService;
