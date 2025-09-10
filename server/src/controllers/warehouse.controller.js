
import WarehouseService from "../services/warehouse.service.js";
import response from "../utils/response.js";

class WarehouseController {
  static async getAll(req, res, next) {
    try {
      const warehouses = await WarehouseService.getAll();
      response.ok(res, warehouses);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const warehouse = await WarehouseService.create(req.body);
      response.ok(res, warehouse, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const warehouse = await WarehouseService.getById(req.params.id);
      if (!warehouse) return response.notFound(res, "warehouse not found");
      response.ok(res, warehouse);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const warehouse = await WarehouseService.update(req.params.id, req.body);
      if (!warehouse) return response.notFound(res, "warehouse not found");
      response.ok(res, warehouse);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const warehouse = await WarehouseService.delete(req.params.id);
      if (!warehouse) return response.notFound(res, "warehouse not found");
      response.ok(res, { message: "warehouse deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default WarehouseController;
