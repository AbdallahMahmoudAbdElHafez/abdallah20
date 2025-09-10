

import GovernateService from "../services/governate.service.js";
import response from "../utils/response.js";

class GovernateController {
  static async getAll(req, res, next) {
    try {
      const governates = await GovernateService.getAll();
      response.ok(res, governates);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const governate = await GovernateService.create(req.body);
      response.ok(res, governate, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const governate = await GovernateService.getById(req.params.id);
      if (!governate) return response.notFound(res, "Governate not found");
      response.ok(res, governate);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const governate = await GovernateService.update(req.params.id, req.body);
      if (!governate) return response.notFound(res, "Governate not found");
      response.ok(res, governate);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const governate = await GovernateService.delete(req.params.id);
      if (!governate) return response.notFound(res, "Governate not found");
      response.ok(res, { message: "Governate deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default GovernateController;
