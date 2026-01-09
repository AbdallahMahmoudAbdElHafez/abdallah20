import { BatchInventory, Batches, Warehouse, Product } from "../models/index.js";

class BatchInventoryService {
    /**
     * Get all batch inventory records
     */
    static async getAll() {
        return await BatchInventory.findAll({
            include: [
                { model: Batches, as: "batch", include: [{ model: Product, as: "product" }] },
                { model: Warehouse, as: "warehouse" }
            ],
            order: [["warehouse_id", "ASC"], ["batch_id", "ASC"]]
        });
    }

    /**
     * Get batch inventory for specific batch and warehouse
     */
    static async getByBatchAndWarehouse(batchId, warehouseId) {
        return await BatchInventory.findOne({
            where: {
                batch_id: batchId,
                warehouse_id: warehouseId
            }
        });
    }

    /**
     * Create or update batch inventory quantity
     * @param {number} batchId - The batch ID
     * @param {number} warehouseId - The warehouse ID
     * @param {number} quantityChange - The quantity change (positive for increase, negative for decrease)
     * @param {object} options - Transaction options
     */
    static async createOrUpdate(batchId, warehouseId, quantityChange, options = {}) {
        // Skip if batch_id is null (unbatched items)
        console.log('Service: Creating or updating batch inventory for batchId:', batchId, 'warehouseId:', warehouseId, 'quantityChange:', quantityChange);
        if (!batchId) {
            return null;
        }

        const existing = await BatchInventory.findOne({
            where: { batch_id: batchId, warehouse_id: warehouseId },
            ...options
        });

        if (existing) {
            const newQuantity = Number(existing.quantity) + Number(quantityChange);

            // Prevent negative quantities
            if (newQuantity < 0) {
                throw new Error(`Insufficient batch inventory. Available: ${existing.quantity}, Requested: ${Math.abs(quantityChange)}`);
            }

            await existing.update({ quantity: newQuantity }, options);
            return existing;
        } else {
            // Creating new record
            if (quantityChange < 0) {
                throw new Error(`Cannot deduct from non-existent batch inventory`);
            }

            return await BatchInventory.create({
                batch_id: batchId,
                warehouse_id: warehouseId,
                quantity: quantityChange
            }, options);
        }
    }

    /**
     * Get inventory for a specific batch across all warehouses
     */
    static async getByBatch(batchId) {
        return await BatchInventory.findAll({
            where: { batch_id: batchId },
            include: [{ model: Warehouse, as: "warehouse" }]
        });
    }

    /**
     * Get inventory for a specific warehouse across all batches
     */
    static async getByWarehouse(warehouseId) {
        return await BatchInventory.findAll({
            where: { warehouse_id: warehouseId },
            include: [{ model: Batches, as: "batch" }]
        });
    }

    /**
     * Get available batches for a product in a specific warehouse
     */
    static async getAvailableBatches(productId, warehouseId) {
        const { Batches, InventoryTransactionBatches, InventoryTransaction } = await import("../models/index.js");
        const { Op } = await import("sequelize");

        const batchInventories = await BatchInventory.findAll({
            where: {
                warehouse_id: warehouseId,
                quantity: { [Op.gt]: 0 }
            },
            include: [
                {
                    model: Batches,
                    as: "batch",
                    where: { product_id: productId },
                    required: true
                }
            ]
        });

        // For each batch, get the latest cost
        const results = await Promise.all(batchInventories.map(async (bi) => {
            const latestTransaction = await InventoryTransactionBatches.findOne({
                where: { batch_id: bi.batch_id },
                include: [{
                    model: InventoryTransaction,
                    as: 'transaction',
                    attributes: ['transaction_date']
                }],
                order: [[{ model: InventoryTransaction, as: 'transaction' }, 'transaction_date', 'DESC']],
                attributes: ['cost_per_unit']
            });

            return {
                ...bi.toJSON(),
                latest_cost: latestTransaction ? latestTransaction.cost_per_unit : 0
            };
        }));

        return results;
    }
}

export default BatchInventoryService;
