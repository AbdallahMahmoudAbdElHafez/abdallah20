import { BatchInventory, Batches, InventoryTransaction, InventoryTransactionBatches, sequelize } from "../models/index.js";
import { Op } from "sequelize";

class FIFOCostService {
    /**
     * Calculate FIFO cost for a single product/warehouse combination
     * @param {number} productId - Product ID
     * @param {number} warehouseId - Warehouse ID
     * @param {number} quantity - Quantity to calculate cost for
     * @param {object} transaction - Sequelize transaction
     * @returns {Promise<{totalCost: number, batchesUsed: Array}>}
     */
    static async calculateFIFOCost(productId, warehouseId, quantity, transaction = null) {
        // Get available batches with their costs using FIFO order
        const availableBatches = await sequelize.query(`
      SELECT 
        bi.batch_id,
        bi.quantity as available_quantity,
        b.batch_number,
        b.expiry_date,
        itb.cost_per_unit,
        it.transaction_date
      FROM batch_inventory bi
      INNER JOIN batches b ON bi.batch_id = b.id
      INNER JOIN inventory_transaction_batches itb ON itb.batch_id = b.id
      INNER JOIN inventory_transactions it ON itb.inventory_transaction_id = it.id
      WHERE b.product_id = :productId
        AND bi.warehouse_id = :warehouseId
        AND bi.quantity > 0
        AND it.transaction_type = 'in'
      ORDER BY it.transaction_date ASC, itb.id ASC
    `, {
            replacements: { productId, warehouseId },
            type: sequelize.QueryTypes.SELECT,
            transaction
        });

        if (availableBatches.length === 0) {
            throw new Error(`No inventory available for product ${productId} in warehouse ${warehouseId}`);
        }

        let remainingQuantity = Number(quantity);
        let totalCost = 0;
        const batchesUsed = [];

        // Process batches in FIFO order
        for (const batch of availableBatches) {
            if (remainingQuantity <= 0) break;

            const availableQty = Number(batch.available_quantity);
            const costPerUnit = Number(batch.cost_per_unit);
            const qtyToUse = Math.min(remainingQuantity, availableQty);

            totalCost += qtyToUse * costPerUnit;
            batchesUsed.push({
                batchId: batch.batch_id,
                batchNumber: batch.batch_number,
                quantity: qtyToUse,
                costPerUnit: costPerUnit,
                subtotal: qtyToUse * costPerUnit
            });

            remainingQuantity -= qtyToUse;
        }

        // Check if we have enough inventory
        if (remainingQuantity > 0) {
            const totalAvailable = availableBatches.reduce((sum, b) => sum + Number(b.available_quantity), 0);
            throw new Error(
                `Insufficient inventory for product ${productId} in warehouse ${warehouseId}. ` +
                `Required: ${quantity}, Available: ${totalAvailable}`
            );
        }

        return {
            totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimal places
            batchesUsed
        };
    }

    /**
     * Calculate FIFO cost for multiple items
     * @param {Array} items - Array of {product_id, warehouse_id, quantity}
     * @param {object} transaction - Sequelize transaction
     * @returns {Promise<{totalCost: number, itemCosts: Array}>}
     */
    static async calculateFIFOCostForItems(items, transaction = null) {
        let totalCost = 0;
        const itemCosts = [];

        for (const item of items) {
            try {
                const { totalCost: itemCost, batchesUsed } = await this.calculateFIFOCost(
                    item.product_id,
                    item.warehouse_id,
                    item.quantity,
                    transaction
                );

                itemCosts.push({
                    product_id: item.product_id,
                    warehouse_id: item.warehouse_id,
                    quantity: item.quantity,
                    cost: itemCost,
                    batches: batchesUsed
                });

                totalCost += itemCost;
            } catch (error) {
                console.error(`FIFO Cost Error for Product ${item.product_id}:`, error.message);
                // For unbatched items or items with no inventory, use 0 cost or throw
                // Option 1: Throw error (strict mode)
                throw error;

                // Option 2: Use 0 cost (lenient mode - uncomment if needed)
                // itemCosts.push({
                //   product_id: item.product_id,
                //   warehouse_id: item.warehouse_id,
                //   quantity: item.quantity,
                //   cost: 0,
                //   batches: [],
                //   error: error.message
                // });
            }
        }

        return {
            totalCost: Math.round(totalCost * 100) / 100,
            itemCosts
        };
    }

    /**
     * Get batch inventory details for a product in a warehouse
     * @param {number} productId - Product ID
     * @param {number} warehouseId - Warehouse ID
     * @param {object} transaction - Sequelize transaction
     * @returns {Promise<Array>}
     */
    static async getBatchInventoryDetails(productId, warehouseId, transaction = null) {
        const batches = await sequelize.query(`
      SELECT 
        bi.batch_id,
        bi.quantity as available_quantity,
        b.batch_number,
        b.expiry_date,
        itb.cost_per_unit,
        it.transaction_date,
        it.note
      FROM batch_inventory bi
      INNER JOIN batches b ON bi.batch_id = b.id
      LEFT JOIN inventory_transaction_batches itb ON itb.batch_id = b.id
      LEFT JOIN inventory_transactions it ON itb.inventory_transaction_id = it.id
      WHERE b.product_id = :productId
        AND bi.warehouse_id = :warehouseId
        AND bi.quantity > 0
        AND it.transaction_type = 'in'
      ORDER BY it.transaction_date ASC, itb.id ASC
    `, {
            replacements: { productId, warehouseId },
            type: sequelize.QueryTypes.SELECT,
            transaction
        });

        return batches;
    }
}

export default FIFOCostService;
