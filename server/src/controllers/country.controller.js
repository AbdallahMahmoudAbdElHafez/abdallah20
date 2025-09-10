
import CountryService from "../services/country.service.js";
import response from "../utils/response.js";

class CountryController {
  static async getAll(req, res, next) {
    try {
      const countries = await CountryService.getAll();
      response.ok(res, countries);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const country = await CountryService.create(req.body);
      response.ok(res, country, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const country = await CountryService.getById(req.params.id);
      if (!country) return response.notFound(res, "Country not found");
      response.ok(res, country);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const country = await CountryService.update(req.params.id, req.body);
      if (!country) return response.notFound(res, "Country not found");
      response.ok(res, country);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const country = await CountryService.delete(req.params.id);
      if (!country) return response.notFound(res, "Country not found");
      response.ok(res, { message: "Country deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default CountryController;
