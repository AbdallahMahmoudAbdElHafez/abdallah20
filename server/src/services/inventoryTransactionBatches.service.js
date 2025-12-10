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

    static async getLatestCost(productId) {
        const { InventoryTransaction } = await import("../models/index.js");
        const result = await InventoryTransactionBatches.findOne({
            include: [{
                model: InventoryTransaction,
                as: 'transaction',
                where: { product_id: productId },
                attributes: []
            }],
            order: [[{ model: InventoryTransaction, as: 'transaction' }, 'transaction_date', 'DESC']],
            attributes: ['cost_per_unit']
        });
        return result ? result.cost_per_unit : 0;
    }
}

export default InventoryTransactionBatchesService;
