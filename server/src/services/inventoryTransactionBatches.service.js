import { InventoryTransactionBatches, Batches } from "../models/index.js";

class InventoryTransactionBatchesService {
    static async create(data) {
        return await InventoryTransactionBatches.create(data);
    }

    static async bulkCreate(data) {
        return await InventoryTransactionBatches.bulkCreate(data);
    }

    static async getByTransactionId(transactionId) {
        return await InventoryTransactionBatches.findAll({
            where: { inventory_transaction_id: transactionId },
            include: [{ model: Batches, as: "batch" }]
        });
    }

    static async deleteByTransactionId(transactionId) {
        return await InventoryTransactionBatches.destroy({
            where: { inventory_transaction_id: transactionId }
        });
    }
}

export default InventoryTransactionBatchesService;
