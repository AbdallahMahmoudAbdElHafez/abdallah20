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

    static async getLatestCost(productId, batchNumber = null) {
        const { InventoryTransaction, Batches } = await import("../models/index.js");

        let whereClause = { product_id: productId };
        let batchInclude = {
            model: Batches,
            as: 'batch',
            required: false
        };

        if (batchNumber) {
            batchInclude.where = { batch_number: batchNumber };
            batchInclude.required = true;
        }

        const result = await InventoryTransactionBatches.findOne({
            include: [
                {
                    model: InventoryTransaction,
                    as: 'transaction',
                    where: whereClause,
                    attributes: []
                },
                batchInclude
            ],
            order: [[{ model: InventoryTransaction, as: 'transaction' }, 'transaction_date', 'DESC']],
            attributes: ['cost_per_unit']
        });
        return result ? result.cost_per_unit : 0;
    }
}

export default InventoryTransactionBatchesService;
