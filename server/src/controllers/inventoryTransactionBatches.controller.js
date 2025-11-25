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
}

export default InventoryTransactionBatchesController;
