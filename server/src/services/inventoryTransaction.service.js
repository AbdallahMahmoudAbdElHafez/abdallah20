import { InventoryTransaction, Product, Warehouse, InventoryTransactionBatches, Batches } from "../models/index.js";
import CurrentInventoryService from "./currentInventory.service.js";
import BatchInventoryService from "./batchInventory.service.js";

class InventoryTransactionService {
  static async getByAll() {
    return await InventoryTransaction.findAll({
      include: [
        { model: Product, as: "product" },
        { model: Warehouse, as: "warehouse" },
        {
          model: InventoryTransactionBatches,
          as: "transaction_batches",
          include: [{ model: Batches, as: "batch" }]
        }
      ],
      order: [["transaction_date", "DESC"]],
    });
  }

  static async getById(id) {
    return await InventoryTransaction.findByPk(id, {
      include: [
        { model: Product, as: "product" },
        { model: Warehouse, as: "warehouse" },
        {
          model: InventoryTransactionBatches,
          as: "transaction_batches",
          include: [{ model: Batches, as: "batch" }]
        }
      ],
    });
  }

  static async create(data, options = {}) {
    if (data.source_id === "") data.source_id = null;

    let totalQuantity = 0;

    // 1. Calculate total quantity first
    if (data.batches && data.batches.length > 0) {
      totalQuantity = data.batches.reduce((sum, b) => sum + Number(b.quantity), 0);
    } else if (data.quantity) {
      totalQuantity = Number(data.quantity);
    }

    // 2. Ensure data.quantity is set for the transaction header
    data.quantity = totalQuantity;

    const trx = await InventoryTransaction.create(data, options);

    // 3. Process batches if they exist
    if (data.batches && data.batches.length > 0) {
      for (const batchData of data.batches) {
        let batchId = null;

        if (batchData.batch_number && batchData.expiry_date) {
          const [batch] = await Batches.findOrCreate({
            where: {
              product_id: data.product_id,
              batch_number: batchData.batch_number
            },
            defaults: {
              expiry_date: batchData.expiry_date
            },
            ...options
          });
          batchId = batch.id;
        } else if (batchData.batch_id) {
          batchId = batchData.batch_id;
        }

        await InventoryTransactionBatches.create({
          inventory_transaction_id: trx.id,
          batch_id: batchId,
          quantity: batchData.quantity,
          cost_per_unit: batchData.cost_per_unit || 0
        }, options);

        if (batchId) {
          const batchQtyChange = data.transaction_type === "in"
            ? Number(batchData.quantity)
            : -Number(batchData.quantity);
          await BatchInventoryService.createOrUpdate(
            batchId,
            data.warehouse_id,
            batchQtyChange,
            options
          );
        }
      }
    }

    // 4. Update Current Inventory
    const quantityChange = data.transaction_type === "in"
      ? totalQuantity
      : -totalQuantity;

    if (totalQuantity > 0) {
      await CurrentInventoryService.createOrUpdate(
        data.product_id,
        data.warehouse_id,
        quantityChange,
        options
      );
    }

    return trx;
  }

  static async update(id, data, options = {}) {
    if (data.source_id === "") data.source_id = null;
    const trx = await InventoryTransaction.findByPk(id, {
      include: [{ model: InventoryTransactionBatches, as: "transaction_batches" }],
      ...options
    });
    if (!trx) throw new Error("Transaction not found");

    // Calculate old quantity from batches
    let oldQty = 0;
    if (trx.transaction_batches) {
      oldQty = trx.transaction_batches.reduce((sum, b) => sum + Number(b.quantity), 0);
    }
    const oldType = trx.transaction_type;

    // Update transaction header
    await trx.update(data, options);

    // Reverse old batch_inventory changes before deleting
    if (trx.transaction_batches) {
      for (const oldBatch of trx.transaction_batches) {
        if (oldBatch.batch_id) {
          const reverseQtyChange = oldType === "in"
            ? -Number(oldBatch.quantity)
            : Number(oldBatch.quantity);
          await BatchInventoryService.createOrUpdate(
            oldBatch.batch_id,
            trx.warehouse_id,
            reverseQtyChange,
            options
          );
        }
      }
    }

    // Handle batches update - simplified: remove old, add new
    // In a real app, we might want to be smarter to preserve IDs or handle partial updates
    await InventoryTransactionBatches.destroy({ where: { inventory_transaction_id: id }, ...options });

    let newQty = 0;
    if (data.batches && data.batches.length > 0) {
      for (const batchData of data.batches) {
        let batchId = null;

        if (batchData.batch_number && batchData.expiry_date) {
          const [batch] = await Batches.findOrCreate({
            where: { product_id: data.product_id || trx.product_id, batch_number: batchData.batch_number },
            defaults: { expiry_date: batchData.expiry_date },
            ...options
          });
          batchId = batch.id;
        } else if (batchData.batch_id) {
          batchId = batchData.batch_id;
        }

        // Always create InventoryTransactionBatches record (batch_id can be null)
        await InventoryTransactionBatches.create({
          inventory_transaction_id: trx.id,
          batch_id: batchId,
          quantity: batchData.quantity,
          cost_per_unit: batchData.cost_per_unit || 0
        }, options);
        newQty += Number(batchData.quantity);

        // Update batch_inventory for new batches
        if (batchId) {
          const batchQtyChange = (data.transaction_type || trx.transaction_type) === "in"
            ? Number(batchData.quantity)
            : -Number(batchData.quantity);
          await BatchInventoryService.createOrUpdate(
            batchId,
            data.warehouse_id || trx.warehouse_id,
            batchQtyChange,
            options
          );
        }
      }
    }

    // Calculate difference
    let qtyDiff = 0;

    if (oldType === "in") qtyDiff -= oldQty;
    else if (oldType === "out") qtyDiff += oldQty;

    if (data.transaction_type === "in") qtyDiff += newQty;
    else if (data.transaction_type === "out") qtyDiff -= newQty;

    if (qtyDiff !== 0) {
      await CurrentInventoryService.createOrUpdate(
        data.product_id || trx.product_id,
        data.warehouse_id || trx.warehouse_id,
        qtyDiff,
        options
      );
    }

    return trx;
  }

  static async remove(id, options = {}) {
    const trx = await InventoryTransaction.findByPk(id, {
      include: [{ model: InventoryTransactionBatches, as: "transaction_batches" }],
      ...options
    });
    if (!trx) throw new Error("Transaction not found");

    let quantity = 0;
    if (trx.transaction_batches) {
      quantity = trx.transaction_batches.reduce((sum, b) => sum + Number(b.quantity), 0);
    }

    // Reverse batch_inventory changes before deletion
    if (trx.transaction_batches) {
      for (const batch of trx.transaction_batches) {
        if (batch.batch_id) {
          const reverseQtyChange = trx.transaction_type === "in"
            ? -Number(batch.quantity)
            : Number(batch.quantity);
          await BatchInventoryService.createOrUpdate(
            batch.batch_id,
            trx.warehouse_id,
            reverseQtyChange,
            options
          );
        }
      }
    }

    // عند الحذف نرجع الكمية إلى ما كانت عليه
    const qtyChange =
      trx.transaction_type === "in" ? -quantity : quantity;

    if (quantity > 0) {
      await CurrentInventoryService.createOrUpdate(
        trx.product_id,
        trx.warehouse_id,
        qtyChange,
        options
      );
    }

    // Delete associated batches first
    await InventoryTransactionBatches.destroy({ where: { inventory_transaction_id: id }, ...options });

    await trx.destroy(options);
    return true;
  }
  /**
   * Get batches using FIFO method
   * @param {number} productId 
   * @param {number} warehouseId 
   * @param {number} requiredQty 
   * @param {object} transaction 
   */
  static async getBatchesFIFO(productId, warehouseId, requiredQty, transaction) {
    const batches = await InventoryTransactionBatches.findAll({
      include: [
        {
          model: Batches,
          as: 'batch',
          required: true,
          where: { product_id: productId }
        }
      ],
      where: {
        '$transaction.warehouse_id$': warehouseId,
        '$transaction.transaction_type$': 'in'
      },
      include: [
        {
          association: 'transaction',
          required: true
        }
      ],
      order: [['transaction', 'transaction_date', 'ASC'], ['id', 'ASC']],
      transaction
    });

    // Calculate available quantity per batch
    const result = [];
    let remaining = requiredQty;

    for (const txBatch of batches) {
      if (remaining <= 0) break;

      // Get all transactions for this batch
      const allTransactions = await InventoryTransactionBatches.findAll({
        where: { batch_id: txBatch.batch_id },
        include: [{
          association: 'transaction',
          where: { warehouse_id: warehouseId }
        }],
        transaction
      });

      // Calculate net quantity for this batch
      let netQty = 0;
      allTransactions.forEach(tx => {
        const qty = parseFloat(tx.quantity);
        if (tx.transaction.transaction_type === 'in') {
          netQty += qty;
        } else {
          netQty -= qty;
        }
      });

      if (netQty > 0) {
        const qtyToUse = Math.min(netQty, remaining);

        // Find batch info to return complete data if needed
        // txBatch.batch is available from the first query

        result.push({
          batch_id: txBatch.batch_id,
          quantity: qtyToUse,
          cost_per_unit: parseFloat(txBatch.cost_per_unit)
        });
        remaining -= qtyToUse;
      }
    }

    return {
      batches: result,
      remainingNeeded: remaining
    };
  }
}

export default InventoryTransactionService;
