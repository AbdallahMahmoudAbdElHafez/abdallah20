import BatchesService from "../services/batches.service.js";
import response from "../utils/response.js";

class BatchesController {
    static async getAll(req, res, next) {
        try {
            const batches = await BatchesService.getAll();
            response.ok(res, batches);
        } catch (err) {
            next(err);
        }
    }

    static async getById(req, res, next) {
        try {
            const batch = await BatchesService.getById(req.params.id);
            if (!batch) return response.notFound(res, "Batch not found");
            response.ok(res, batch);
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const batch = await BatchesService.create(req.body);
            response.ok(res, batch, 201);
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const batch = await BatchesService.update(req.params.id, req.body);
            if (!batch) return response.notFound(res, "Batch not found");
            response.ok(res, batch);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const batch = await BatchesService.delete(req.params.id);
            if (!batch) return response.notFound(res, "Batch not found");
            response.ok(res, { message: "Batch deleted" });
        } catch (err) {
            next(err);
        }
    }
}

export default BatchesController;
