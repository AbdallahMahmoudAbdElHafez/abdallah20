import { InventoryTransaction, Product, Warehouse } from "../models/index.js";
import CurrentInventoryService from "./currentInventory.service.js";

class InventoryTransactionService {
  static async getByAll() {
    return await InventoryTransaction.findAll({
      include: [
        { model: Product, as: "product" },
        { model: Warehouse, as: "warehouse" },
      ],
      order: [["transaction_date", "DESC"]],
    });
  }

  static async getById(id) {
    return await InventoryTransaction.findByPk(id, {
      include: [
        { model: Product, as: "product" },
        { model: Warehouse, as: "warehouse" },
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
