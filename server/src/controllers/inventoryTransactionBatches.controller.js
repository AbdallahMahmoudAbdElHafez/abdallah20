import InventoryTransactionBatchesService from "../services/inventoryTransactionBatches.service.js";
import response from "../utils/response.js";

class InventoryTransactionBatchesController {
    static async getByTransactionId(req, res, next) {
        try {
            const data = await InventoryTransactionBatchesService.getByTransactionId(req.params.transactionId);
            return response.ok(res, data);
        } catch (err) {
            next(err);
        }
    }

    static async getLatestCost(req, res, next) {
        try {
            const { batchNumber } = req.query;
            const cost = await InventoryTransactionBatchesService.getLatestCost(req.params.productId, batchNumber);
            return response.ok(res, { cost });
        } catch (err) {
            next(err);
        }
    }
}

export default InventoryTransactionBatchesController;
