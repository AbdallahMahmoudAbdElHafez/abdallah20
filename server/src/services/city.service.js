import { City , Governate } from "../models/index.js";


class CityService {

  static async getAll() {
    return await City.findAll({ include: [{ model: Governate, as: "governate" }] });
  }
    static async create(data) {
    return await City.create(data);
  }

  static async getById(id) {
    return await City.findByPk(id, { include: [{ model: Governate, as: "governate" }] });
  }

  static async update(id, data) {
    const city = await City.findByPk(id);
    if (!city) return null;
    return await city.update(data);
  }

  static async delete(id) {
    const city = await City.findByPk(id);
    if (!city) return null;
    await city.destroy();
    return city;
  }

 
}


export default CityService;