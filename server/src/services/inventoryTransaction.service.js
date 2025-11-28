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

  static async create(data) {
    if (data.source_id === "") data.source_id = null;
    const trx = await InventoryTransaction.create(data);

    let totalQuantity = 0;

    if (data.batches && data.batches.length > 0) {
      for (const batchData of data.batches) {
        let batchId = batchData.batch_id;

        // If no ID but number/expiry provided (for IN transactions), find or create batch
        if (!batchId && batchData.batch_number && batchData.expiry_date) {
          const [batch] = await Batches.findOrCreate({
            where: {
              product_id: data.product_id,
              batch_number: batchData.batch_number
            },
            defaults: {
              expiry_date: batchData.expiry_date
            }
          });
          batchId = batch.id;
        }

        if (batchId) {
          await InventoryTransactionBatches.create({
            inventory_transaction_id: trx.id,
            batch_id: batchId,
            quantity: batchData.quantity,
            cost_per_unit: batchData.cost_per_unit || 0
          });
          totalQuantity += Number(batchData.quantity);
        }
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
        quantityChange
      );
    }

    return trx;
  }

  static async update(id, data) {
    if (data.source_id === "") data.source_id = null;
    const trx = await InventoryTransaction.findByPk(id, {
      include: [{ model: InventoryTransactionBatches, as: "transaction_batches" }]
    });
    if (!trx) throw new Error("Transaction not found");

    // Calculate old quantity from batches
    let oldQty = 0;
    if (trx.transaction_batches) {
      oldQty = trx.transaction_batches.reduce((sum, b) => sum + Number(b.quantity), 0);
    }
    const oldType = trx.transaction_type;

    // Update transaction header
    await trx.update(data);

    // Handle batches update - simplified: remove old, add new
    // In a real app, we might want to be smarter to preserve IDs or handle partial updates
    await InventoryTransactionBatches.destroy({ where: { inventory_transaction_id: id } });

    let newQty = 0;
    if (data.batches && data.batches.length > 0) {
      for (const batchData of data.batches) {
        let batchId = batchData.batch_id;
        if (!batchId && batchData.batch_number && batchData.expiry_date) {
          const [batch] = await Batches.findOrCreate({
            where: { product_id: data.product_id || trx.product_id, batch_number: batchData.batch_number },
            defaults: { expiry_date: batchData.expiry_date }
          });
          batchId = batch.id;
        }

        if (batchId) {
          await InventoryTransactionBatches.create({
            inventory_transaction_id: trx.id,
            batch_id: batchId,
            quantity: batchData.quantity,
            cost_per_unit: batchData.cost_per_unit || 0
          });
          newQty += Number(batchData.quantity);
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
        qtyDiff
      );
    }

    return trx;
  }

  static async remove(id) {
    const trx = await InventoryTransaction.findByPk(id, {
      include: [{ model: InventoryTransactionBatches, as: "transaction_batches" }]
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
        qtyChange
      );
    }

    // Delete associated batches first
    await InventoryTransactionBatches.destroy({ where: { inventory_transaction_id: id } });

    await trx.destroy();
    return true;
  }
}

export default InventoryTransactionService;
