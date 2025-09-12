// controllers/inventoryTransaction.controller.js
import response from "../utils/response.js";
import InventoryTransactionService from "../services/inventoryTransaction.service.js";
class InventoryTransactionController {
    static async getAll(req, res, next) {
        try {
            const data = await InventoryTransactionService.getByAll();
            return response.ok(res, data);
        } catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const data = await InventoryTransactionService.getById(req.params.id);
            if (!data) return response.notFound(res, "Transaction not found");
            return response.ok(res, data);
        } catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const data = await InventoryTransactionService.create(req.body);
            return response.ok(res, data, 201);
        } catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const data = await InventoryTransactionService.update(req.params.id, req.body);
            return response.ok(res, data);
        } catch (err) {
            next(err);
        }
    }
    static async remove(req, res, next) {
        try {
            await InventoryTransactionService.remove(req.params.id);
            return response.ok(res, { message: "Deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
}

export default InventoryTransactionController;


