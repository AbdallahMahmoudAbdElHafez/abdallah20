import { InventoryTransaction, Product, Warehouse, InventoryTransactionBatches, Batches } from "../models/index.js";
import CurrentInventoryService from "./currentInventory.service.js";

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
    const trx = await InventoryTransaction.create(data, options);

    let totalQuantity = 0;

    if (data.batches && data.batches.length > 0) {
      for (const batchData of data.batches) {
        let batchId = null;

        // If batch_number and expiry_date provided, find or create batch
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
          // Use provided batch_id if available
          batchId = batchData.batch_id;
        }

        // Always create InventoryTransactionBatches record (batch_id can be null)
        await InventoryTransactionBatches.create({
          inventory_transaction_id: trx.id,
          batch_id: batchId,
          quantity: batchData.quantity,
          cost_per_unit: batchData.cost_per_unit || 0
        }, options);
        totalQuantity += Number(batchData.quantity);
      }
    }

    // If no batches, maybe we should throw error? 
    // But for now, if totalQuantity is 0, we just don't update current inventory or update with 0.
    // Assuming data.quantity might be passed for validation but we use calculated totalQuantity.

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
}

export default InventoryTransactionService;
