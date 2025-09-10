
import { Unit } from "../models/index.js";

class UnitService {
  static async getAll() {
    return await Unit.findAll();
  }

  static async create(data) {
    return await Unit.create(data);
  }

  static async getById(id) {
    return await Unit.findByPk(id);
  }

  static async update(id, data) {
    const unit = await Unit.findByPk(id);
    if (!unit) return null;
    return await unit.update(data);
  }

  static async delete(id) {
    const unit = await Unit.findByPk(id);
    if (!unit) return null;
    await unit.destroy();
    return unit;
  }
}

export default UnitService;
