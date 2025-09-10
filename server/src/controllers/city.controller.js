
import CountryService from "../services/city.service.js";
import response from "../utils/response.js";

class CityController {
static async getAll(req, res, next) {
  try {
    try {
      const countries = await CountryService.getAll();
      response.ok(res, countries);
    } catch (err) {
      next(err);
    }
    } catch (err) {
        next(err);
    }
    }
  static async create(req, res, next) {
    try {
      const city = await CountryService.create(req.body);
      response.ok(res, city, 201);
    } catch (err) {
      next(err);
    }
  }
    static async getById(req, res, next) {
    try {
      const city = await CountryService.getById(req.params.id);
      if (!city) return response.notFound(res, "City not found");
      response.ok(res, city);
    } catch (err) {
      next(err);
    }
    }
    static async update(req, res, next) {
    try {
      const city = await CountryService.update(req.params.id, req.body);
        if (!city) return response.notFound(res, "City not found");
        response.ok(res, city);
    } catch (err) {
        next(err);
    }
    }
    static async delete(req, res, next) {
    try {
      const city = await CountryService.delete(req.params.id);
        if (!city) return response.notFound(res, "City not found");
        response.ok(res, { message: "City deleted" });
    } catch (err) {
        next(err);
    }
}

}

export default CityController;
