import { Governate, Country } from "../models/index.js";

class GovernateService {
  static async getAll() {
    return await Governate.findAll({ include: [{ model: Country, as: "country" }] });
  }

  static async create(data) {
    return await Governate.create(data);
  }

  static async getById(id) {
    return await Governate.findByPk(id, { include: [{ model: Country, as: "country" }] });
  }

  static async update(id, data) {
    const governate = await Governate.findByPk(id);
    if (!governate) return null;
    return await governate.update(data);
  }

  static async delete(id) {
    const governate = await Governate.findByPk(id);
    if (!governate) return null;
    await governate.destroy();
    return governate;
  }
}

export default GovernateService;