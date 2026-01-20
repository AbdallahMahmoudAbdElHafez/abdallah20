import { BatchInventory, Batches, Product, InventoryTransactionBatches, InventoryTransaction } from "../models/index.js";
import { Op } from "sequelize";

class WarehouseInventoryService {
    static async getProductsByWarehouse(warehouseId) {
        const products = await Product.findAll({
            include: [
                {
                    model: CurrentInventory,
                    as: 'current_inventory',
                    where: { warehouse_id: warehouseId },
                    required: false
                }
            ]
        });

        return products.map(p => ({
            id: p.id,
            name: p.name,
            current_inventory: p.current_inventory
        }));
    }

    static async getBatchesByProductAndWarehouse(warehouseId, productId) {
        const inventory = await BatchInventory.findAll({
            where: {
                warehouse_id: warehouseId,
                quantity: { [Op.gt]: 0 }
            },
            include: [
                {
                    model: Batches,
                    as: 'batch',
                    where: { product_id: productId },
                    required: true
                }
            ]
        });

        const batchesWithDetails = await Promise.all(inventory.map(async (item) => {
            const batch = item.batch;

            // Get latest cost for this batch
            const latestTransactionBatch = await InventoryTransactionBatches.findOne({
                where: { batch_id: batch.id },
                include: [{
                    model: InventoryTransaction,
                    as: 'transaction',
                    where: { transaction_type: 'in' }, // Usually cost is determined by 'in' transactions
                    required: true
                }],
                order: [[{ model: InventoryTransaction, as: 'transaction' }, 'transaction_date', 'DESC']],
                attributes: ['cost_per_unit']
            });

            return {
                id: batch.id,
                batch_number: batch.batch_number,
                expiry_date: batch.expiry_date,
                available_quantity: item.quantity,
                cost_per_unit: latestTransactionBatch ? latestTransactionBatch.cost_per_unit : 0
            };
        }));

        return batchesWithDetails;
    }
}

export default WarehouseInventoryService;
