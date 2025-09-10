import PartyService from "../services/party.service.js";
import response from "../utils/response.js";
class PartyController {
  static async getAll(req, res, next) {
    try {
        const parties = await PartyService.getAll();
        response.ok(res, parties);
    } catch (err) {
        next(err);
    }
    }
    static async create(req, res, next) {
    try {
        const party = await PartyService.create(req.body);
        response.ok(res, party, 201);
    } catch (err) {
        next(err);
    }
    }
    static async getById(req, res, next) {
    try {
        const party = await PartyService.getById(req.params.id);    
        if (!party) return response.notFound(res, "Party not found");
        response.ok(res, party);
    }
    catch (err) {
        next(err);
    }
    }
    static async update(req, res, next) {
    try {
        const party = await PartyService.update(req.params.id, req.body);
        if (!party) return response.notFound(res, "Party not found");
        response.ok(res, party);
    } catch (err) {
        next(err);
    }
    }
    static async delete(req, res, next) {
    try {
        const party = await PartyService.delete(req.params.id); 
        if (!party) return response.notFound(res, "Party not found");
        response.ok(res, { message: "Party deleted" });
    } catch (err) {
        next(err);
    }
    }
}
export default PartyController;