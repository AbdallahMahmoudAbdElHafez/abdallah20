import e from "express";
import UnitService from "../services/unit.service.js";
import response from "../utils/response.js";

class UnitController {
  static async getAll(req, res, next) {
    try {
      const units = await UnitService.getAll();
      response.ok(res, units);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const unit = await UnitService.create(req.body);
      response.ok(res, unit, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const unit = await UnitService.getById(req.params.id);
      if (!unit) return response.notFound(res, "Unit not found");
      response.ok(res, unit);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const unit = await UnitService.update(req.params.id, req.body);
      if (!unit) return response.notFound(res, "Unit not found");
      response.ok(res, unit);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const unit = await UnitService.delete(req.params.id);
      if (!unit) return response.notFound(res, "Unit not found");
      response.ok(res, { message: "Unit deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default UnitController;
