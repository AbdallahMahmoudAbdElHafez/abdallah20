// src/hooks/inventoryTransactionHooks.js
import CurrentInventoryService from "../services/currentInventory.service.js";

const inventoryTransactionHooks = {
  // بعد إنشاء عملية واحدة
  async afterCreate(transaction, options) {
    const qtyChange = transaction.transaction_type === "in"
      ? transaction.quantity
      : -transaction.quantity;

    await CurrentInventoryService.createOrUpdate(
      transaction.product_id,
      transaction.warehouse_id,
      qtyChange
    );
  },

  // بعد إنشاء عمليات متعددة دفعة واحدة
  async afterBulkCreate(transactions, options) {
    for (const trx of transactions) {
      const qtyChange = trx.transaction_type === "in"
        ? trx.quantity
        : -trx.quantity;

      await CurrentInventoryService.createOrUpdate(
        trx.product_id,
        trx.warehouse_id,
        qtyChange
      );
    }
  },
};

export default inventoryTransactionHooks;
