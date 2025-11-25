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
    const trx = await InventoryTransaction.create(data);

    const quantityChange = data.transaction_type === "in"
      ? data.quantity
      : -data.quantity;

    await CurrentInventoryService.createOrUpdate(
      data.product_id,
      data.warehouse_id,
      quantityChange
    );

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
            cost_per_unit: batchData.cost_per_unit || data.cost_per_unit
          });
        }
      }
    }

    return trx;
  }

  static async update(id, data) {
    const trx = await InventoryTransaction.findByPk(id);
    if (!trx) throw new Error("Transaction not found");

    // احسب الفرق بين الكمية القديمة والجديدة
    const oldQty = trx.quantity;
    const oldType = trx.transaction_type;

    await trx.update(data);

    // نحسب التغير في الكمية بناء على النوع الجديد
    let qtyDiff = 0;

    if (oldType === "in") qtyDiff -= oldQty;
    else if (oldType === "out") qtyDiff += oldQty;

    if (data.transaction_type === "in") qtyDiff += data.quantity;
    else if (data.transaction_type === "out") qtyDiff -= data.quantity;

    if (qtyDiff !== 0) {
      await CurrentInventoryService.createOrUpdate(
        data.product_id,
        data.warehouse_id,
        qtyDiff
      );
    }

    return trx;
  }

  static async remove(id) {
    const trx = await InventoryTransaction.findByPk(id);
    if (!trx) throw new Error("Transaction not found");

    // عند الحذف نرجع الكمية إلى ما كانت عليه
    const qtyChange =
      trx.transaction_type === "in" ? -trx.quantity : trx.quantity;

    await CurrentInventoryService.createOrUpdate(
      trx.product_id,
      trx.warehouse_id,
      qtyChange
    );

    await trx.destroy();
    return true;
  }
}

export default InventoryTransactionService;
