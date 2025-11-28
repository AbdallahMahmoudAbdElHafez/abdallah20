// server/src/services/purchaseInvoiceItem.service.js

import { PurchaseInvoiceItem, PurchaseInvoice } from "../models/index.js";
import InventoryTransactionService from './inventoryTransaction.service.js';

class PurchaseInvoiceItemService {

  static async findAll(invoiceId) {
    return PurchaseInvoiceItem.findAll({ where: { purchase_invoice_id: invoiceId } });
  }

  static async findById(id) {
    return PurchaseInvoiceItem.findByPk(id);
  }

  static async create(data) {
    const item = await PurchaseInvoiceItem.create(data);

    // Create Inventory Transaction
    const batches = [];
    const totalQty = Number(item.quantity) + Number(item.bonus_quantity || 0);
    if (item.batch_number && item.expiry_date) {
      batches.push({
        batch_number: item.batch_number,
        expiry_date: item.expiry_date,
        quantity: totalQty,
        cost_per_unit: Number(item.unit_price)
      });
    }

    // Fetch invoice for date/number
    const invoice = await PurchaseInvoice.findByPk(item.purchase_invoice_id);

    await InventoryTransactionService.create({
      product_id: item.product_id,
      warehouse_id: item.warehouse_id,
      transaction_type: "in",
      transaction_date: invoice?.invoice_date || new Date(),
      note: `Added from Purchase Invoice ${invoice?.invoice_number || item.purchase_invoice_id}`,
      source_type: 'purchase',
      source_id: item.id, // Use Item ID
      batches: batches
    });

    return item;
  }


  static async update(id, data) {
    // Reverse old transaction
    const oldTransactions = await InventoryTransactionService.getAll({ source_type: 'purchase', source_id: id });
    // InventoryTransactionService.getAll might not support filtering by source_type/id directly if not implemented.
    // Let's use the model directly or assume we can find it.
    // Actually InventoryTransactionService doesn't have a flexible getAll.
    // Let's import InventoryTransaction model to find it.
    // But we can't import model here if we didn't export it from index properly or if we want to keep service clean.
    // Let's assume we can use InventoryTransactionService.remove if we know the ID.
    // But we don't know the ID of the transaction.
    // We need to find it.
    // Let's import InventoryTransaction from models.
    const { InventoryTransaction } = await import('../models/index.js');
    const oldTrx = await InventoryTransaction.findOne({ where: { source_type: 'purchase', source_id: id } });
    if (oldTrx) {
      await InventoryTransactionService.remove(oldTrx.id);
    }

    await PurchaseInvoiceItem.update(data, {
      where: { id },
      fields: [
        "batch_number",
        "expiry_date",
        "quantity",
        "bonus_quantity",
        "unit_price",
        "discount",
      ],
    });

    const item = await PurchaseInvoiceItem.findByPk(id);

    // Create new transaction
    const batches = [];
    const totalQty = Number(item.quantity) + Number(item.bonus_quantity || 0);
    if (item.batch_number && item.expiry_date) {
      batches.push({
        batch_number: item.batch_number,
        expiry_date: item.expiry_date,
        quantity: totalQty,
        cost_per_unit: Number(item.unit_price)
      });
    }

    const invoice = await PurchaseInvoice.findByPk(item.purchase_invoice_id);

    await InventoryTransactionService.create({
      product_id: item.product_id,
      warehouse_id: item.warehouse_id,
      transaction_type: "in",
      transaction_date: invoice?.invoice_date || new Date(),
      note: `Updated in Purchase Invoice ${invoice?.invoice_number || item.purchase_invoice_id}`,
      source_type: 'purchase',
      source_id: item.id,
      batches: batches
    });

    return item;
  }


  static async delete(id) {
    const { InventoryTransaction } = await import('../models/index.js');
    const oldTrx = await InventoryTransaction.findOne({ where: { source_type: 'purchase', source_id: id } });
    if (oldTrx) {
      await InventoryTransactionService.remove(oldTrx.id);
    }
    return PurchaseInvoiceItem.destroy({ where: { id } });
  }
}

export default PurchaseInvoiceItemService;
