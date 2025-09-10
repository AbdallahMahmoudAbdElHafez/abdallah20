
import {Country}  from "../models/index.js";

class CountryService {
  static async getAll() {
    return await Country.findAll();
  }

  static async create(data) {
    return await Country.create(data);
  }

  static async getById(id) {
    return await Country.findByPk(id);
  }

  static async update(id, data) {
    const country = await Country.findByPk(id);
    if (!country) return null;
    return await country.update(data);
  }

  static async delete(id) {
    const country = await Country.findByPk(id);
    if (!country) return null;
    await country.destroy();
    return country;
  }
}

export default CountryService;
