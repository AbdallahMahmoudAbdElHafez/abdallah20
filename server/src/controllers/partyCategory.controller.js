import PartyCategoryService from "../services/partyCategory.service.js";
import response from "../utils/response.js";
class PartyCategoryController {
  static async getAll(req, res, next) {
    try {
        const partyCategories = await PartyCategoryService.getAll();
        response.ok(res, partyCategories);
    } catch (err) {
        next(err);
    }
    }
    static async create(req, res, next) {
    try {
        const partyCategory = await PartyCategoryService.create(req.body);
        response.ok(res, partyCategory, 201);
    } catch (err) {
        next(err);
    }
    }
    static async getById(req, res, next) {
    try {
        const partyCategory = await PartyCategoryService.getById(req.params.id);    
        if (!partyCategory) return response.notFound(res, "Party category not found");
        response.ok(res, partyCategory);
    }
    catch (err) {
        next(err);
    }
    }
    static async update(req, res, next) {
    try {
        const partyCategory = await PartyCategoryService.update(req.params.id, req.body);
        if (!partyCategory) return response.notFound(res, "Party category not found");
        response.ok(res, partyCategory);
    } catch (err) {
        next(err);
    }
    }
    static async delete(req, res, next) {
    try {
        const partyCategory = await PartyCategoryService.delete(req.params.id); 
        if (!partyCategory) return response.notFound(res, "Party category not found");
        response.ok(res, { message: "Party category deleted" });
    } catch (err) {
        next(err);
    }
    }
}




export default PartyCategoryController;
