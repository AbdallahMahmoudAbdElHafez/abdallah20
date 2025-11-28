// src/hooks/inventoryTransactionHooks.js
import CurrentInventoryService from "../services/currentInventory.service.js";

const inventoryTransactionHooks = {
  // Logic moved to Service because 'quantity' is no longer in InventoryTransaction table
  // and we need to sum up batches which are created after the transaction.

  // afterCreate(transaction, options) { ... },
  // afterBulkCreate(transactions, options) { ... }
};

export default inventoryTransactionHooks;
