import { Warehouse, City } from "../models/index.js";

class WarehouseService {
    
  static async getAll() {
    return await Warehouse.findAll({ include: [{ model: City, as: "city" }] });
  }

  static async create(data) {
    return await Warehouse.create(data);
  }

  static async getById(id) {
    return await Warehouse.findByPk(id, { include: [{ model: City, as: "city" }] });
  }

  static async update(id, data) {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) return null;
    return await warehouse.update(data);
  }

  static async delete(id) {
    const governate = await Warehouse.findByPk(id);
    if (!governate) return null;
    await governate.destroy();
    return governate;
  }
}


export default WarehouseService;