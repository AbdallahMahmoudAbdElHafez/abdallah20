import EntryTypeService from "../services/entryTypes.service.js";
import response from "../utils/response.js";

class EntryTypeController {
    static async getAll(req, res, next) {
        try {
            const entryTypes = await EntryTypeService.getAll();
            response.ok(res, entryTypes);
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const entryType = await EntryTypeService.create(req.body);
            response.ok(res, entryType, 201);
        } catch (err) {
            next(err);
        }
    }

    static async getById(req, res, next) {
        try {
            const entryType = await EntryTypeService.getById(req.params.id);
            if (!entryType) return response.notFound(res, "Entry Type not found");
            response.ok(res, entryType);
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const entryType = await EntryTypeService.update(req.params.id, req.body);
            if (!entryType) return response.notFound(res, "Entry Type not found");
            response.ok(res, entryType);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const entryType = await EntryTypeService.delete(req.params.id);
            if (!entryType) return response.notFound(res, "Entry Type not found");
            response.ok(res, { message: "Entry Type deleted" });
        } catch (err) {
            next(err);
        }
    }
}

export default EntryTypeController;
