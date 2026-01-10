import { InventoryTransaction, Product, Warehouse, InventoryTransactionBatches, Batches, ReferenceType } from "../models/index.js";
import CurrentInventoryService from "./currentInventory.service.js";
import BatchInventoryService from "./batchInventory.service.js";
import { ENTRY_TYPES } from "../constants/entryTypes.js";

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

    // Support flat batch fields if batches array is missing
    if ((!data.batches || data.batches.length === 0) && data.batch_number && data.expiry_date) {
      data.batches = [{
        batch_number: data.batch_number,
        expiry_date: data.expiry_date,
        quantity: data.quantity,
        cost_per_unit: data.cost_per_unit
      }];
    }

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

        if (batchData.batch_number) {
          const [batch] = await Batches.findOrCreate({
            where: {
              product_id: data.product_id,
              batch_number: batchData.batch_number
            },
            defaults: {
              expiry_date: batchData.expiry_date || null
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

    // 5. Create Journal Entry for Adjustments
    if (data.source_type === 'adjustment' && totalQuantity > 0) {
      try {
        await InventoryTransactionService.syncJournalEntry(trx, options);
      } catch (err) {
        console.error("Failed to sync journal entry for inventory adjustment:", err);
      }
    } else if (data.source_type === 'opening' && totalQuantity > 0) {
      // 6. Create Journal Entry for Opening Balance
      try {
        await InventoryTransactionService.syncOpeningJournalEntry(trx, options);
      } catch (err) {
        console.error("Failed to sync journal entry for inventory opening balance:", err);
      }
    }

    return trx;
  }

  static async update(id, data, options = {}) {
    if (data.source_id === "") data.source_id = null;

    // Support flat batch fields if batches array is missing
    if ((!data.batches || data.batches.length === 0) && data.batch_number && data.expiry_date) {
      data.batches = [{
        batch_number: data.batch_number,
        expiry_date: data.expiry_date,
        quantity: data.quantity,
        cost_per_unit: data.cost_per_unit
      }];
    }
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

        if (batchData.batch_number) {
          const [batch] = await Batches.findOrCreate({
            where: { product_id: data.product_id || trx.product_id, batch_number: batchData.batch_number },
            defaults: { expiry_date: batchData.expiry_date || null },
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

    // Update Journal Entry for Adjustments or Opening
    if ((data.source_type || trx.source_type) === 'adjustment') {
      try {
        await InventoryTransactionService.syncJournalEntry(trx, options);
      } catch (err) {
        console.error("Failed to sync journal entry for inventory adjustment update:", err);
      }
    } else if ((data.source_type || trx.source_type) === 'opening') {
      try {
        await InventoryTransactionService.syncOpeningJournalEntry(trx, options);
      } catch (err) {
        console.error("Failed to sync journal entry for inventory opening update:", err);
      }
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

    // Delete associated Journal Entry for Adjustments
    if (trx.source_type === 'adjustment') {
      try {
        const { JournalEntry } = await import("../models/index.js");
        const refType = await ReferenceType.findOne({ where: { code: 'inventory_adjustment' }, ...options });
        if (refType) {
          await JournalEntry.destroy({ where: { reference_type_id: refType.id, reference_id: id }, ...options });
        }
      } catch (err) {
        console.error("Failed to delete journal entry for inventory adjustment:", err);
      }
    } else if (trx.source_type === 'opening') {
      try {
        const { JournalEntry } = await import("../models/index.js");
        // Using ID 73 as requested for opening inventory
        await JournalEntry.destroy({ where: { reference_type_id: 73, reference_id: id }, ...options });
      } catch (err) {
        console.error("Failed to delete journal entry for inventory opening:", err);
      }
    }

    await trx.destroy(options);
    return true;
  }

  static async syncJournalEntry(trx, options = {}) {
    const { createJournalEntry } = await import('./journal.service.js');
    const { JournalEntry, Product: ProductModel } = await import('../models/index.js');

    // 1. Ensure ReferenceType exists
    let refType = await ReferenceType.findOne({ where: { code: 'inventory_adjustment' }, ...options });
    if (!refType) {
      refType = await ReferenceType.create({
        code: 'inventory_adjustment',
        name: 'تسوية مخزنية',
        label: 'تسوية مخزنية',
        description: 'Inventory Adjustment Transaction'
      }, options);
    }

    // 2. Delete existing entry if any (to update)
    await JournalEntry.destroy({
      where: { reference_type_id: refType.id, reference_id: trx.id },
      ...options
    });

    // 3. Prepare Account Mapping
    const INVENTORY_ACCOUNTS = {
      FINISHED_GOODS: 110,    // مخزون تام الصنع
      RAW_MATERIALS: 111,     // مخزون أولي
      DEFAULT: 49             // المخزون
    };

    const product = await ProductModel.findByPk(trx.product_id, options);
    const accountId = product?.type_id === 1 ? INVENTORY_ACCOUNTS.FINISHED_GOODS :
      (product?.type_id === 2 ? INVENTORY_ACCOUNTS.RAW_MATERIALS : INVENTORY_ACCOUNTS.DEFAULT);

    const CONTRA_ACCOUNT = 114; // فروقات جرد مخزون

    // 4. Calculate total cost
    // Use the cost from transaction batches if available, otherwise fallback to product cost
    const trxBatches = await InventoryTransactionBatches.findAll({
      where: { inventory_transaction_id: trx.id },
      ...options
    });

    let totalCost = 0;
    if (trxBatches.length > 0) {
      totalCost = trxBatches.reduce((sum, b) => sum + (Number(b.quantity) * Number(b.cost_per_unit || product?.cost_price || 0)), 0);
    } else {
      totalCost = Number(trx.quantity) * Number(product?.cost_price || 0);
    }

    if (totalCost <= 0) return;

    // 5. Create Lines
    const lines = [];
    if (trx.transaction_type === 'in') {
      // Dr Inventory, Cr Contra
      lines.push({
        account_id: accountId,
        debit: totalCost,
        credit: 0,
        description: `إضافة مخزون (تسوية) - ${trx.note || ''}`
      });
      lines.push({
        account_id: CONTRA_ACCOUNT,
        debit: 0,
        credit: totalCost,
        description: `مواجهة تسوية إضافة مخزون - ${trx.note || ''}`
      });
    } else {
      // Dr Contra, Cr Inventory
      lines.push({
        account_id: CONTRA_ACCOUNT,
        debit: totalCost,
        credit: 0,
        description: `صرف مخزون (تسوية) - ${trx.note || ''}`
      });
      lines.push({
        account_id: accountId,
        debit: 0,
        credit: totalCost,
        description: `مواجهة تسوية صرف مخزون - ${trx.note || ''}`
      });
    }

    // 6. Create Journal Entry
    await createJournalEntry({
      refCode: 'inventory_adjustment',
      refId: trx.id,
      entryDate: trx.transaction_date,
      description: `قيد جرد مخزون – تسوية فرق فعلي #${trx.id} - ${trx.note || ''}`,
      lines: lines,
      entryTypeId: ENTRY_TYPES.INVENTORY_COUNT // 44
    }, options);
  }

  static async syncOpeningJournalEntry(trx, options = {}) {
    const { createJournalEntry } = await import('./journal.service.js');
    const { JournalEntry, JournalEntryLine, Product: ProductModel } = await import('../models/index.js');

    // 1. Define Constants
    const REFERENCE_TYPE_ID = 73; // Opening Inventory Reference Type
    const ENTRY_TYPE_ID = 1;      // Opening Entry Type
    const CAPITAL_ACCOUNT_ID = 14; // رأس المال

    // 2. Prepare Account Mapping
    const INVENTORY_ACCOUNTS = {
      FINISHED_GOODS: 110,
      RAW_MATERIALS: 111,
      DEFAULT: 49
    };

    const product = await ProductModel.findByPk(trx.product_id, options);
    const inventoryAccountId = product?.type_id === 1 ? INVENTORY_ACCOUNTS.FINISHED_GOODS :
      (product?.type_id === 2 ? INVENTORY_ACCOUNTS.RAW_MATERIALS : INVENTORY_ACCOUNTS.DEFAULT);

    // 3. Calculate total cost
    const trxBatches = await InventoryTransactionBatches.findAll({
      where: { inventory_transaction_id: trx.id },
      ...options
    });

    let totalCost = 0;
    if (trxBatches.length > 0) {
      totalCost = trxBatches.reduce((sum, b) => sum + (Number(b.quantity) * Number(b.cost_per_unit || product?.cost_price || 0)), 0);
    } else {
      totalCost = Number(trx.quantity) * Number(product?.cost_price || 0);
    }

    if (totalCost <= 0) return;

    // 4. Create Lines Data
    const lines = [];

    // Dr Inventory (110/111/49)
    lines.push({
      account_id: inventoryAccountId,
      debit: totalCost,
      credit: 0,
      description: `مخزون افتتاحي - ${product?.name || ''} - ${trx.note || ''}`
    });

    // Cr Capital (10)
    lines.push({
      account_id: CAPITAL_ACCOUNT_ID,
      debit: 0,
      credit: totalCost,
      description: `رأس المال - مخزون افتتاحي - ${product?.name || ''}`
    });

    // 5. Find or Create Journal Entry
    // We check for existing entry (including soft deleted ones if necessary, but usually checking active is enough unless index is strict)
    // To be safe against "Duplicate entry" on unique index, we should find strictly by uniqueness keys.
    let entry = await JournalEntry.findOne({
      where: { reference_type_id: REFERENCE_TYPE_ID, reference_id: trx.id },
      paranoid: false, // Check even if soft deleted to avoid UniqueConstraintError
      ...options
    });

    if (entry) {
      // Restore if it was soft deleted
      if (entry.deleted_at) {
        await entry.restore(options);
      }

      // Update existing entry
      await entry.update({
        entry_type_id: ENTRY_TYPE_ID,
        date: trx.transaction_date,
        description: `قيد افتتاحي للمخزون - ${trx.note || ''}`,
        is_posted: 1
      }, options);

      // Delete existing lines (hard delete to replace)
      await JournalEntryLine.destroy({
        where: { journal_entry_id: entry.id },
        force: true, // Force delete lines to cleanly replace
        ...options
      });
    } else {
      // Create new entry
      entry = await JournalEntry.create({
        reference_type_id: REFERENCE_TYPE_ID,
        reference_id: trx.id,
        entry_type_id: ENTRY_TYPE_ID,
        date: trx.transaction_date,
        description: `قيد افتتاحي للمخزون - ${trx.note || ''}`,
        is_posted: 1
      }, options);
    }

    // 6. Create Lines
    const entryLines = lines.map(line => ({
      journal_entry_id: entry.id,
      account_id: line.account_id,
      debit: line.debit,
      credit: line.credit,
      description: line.description
    }));

    await JournalEntryLine.bulkCreate(entryLines, options);
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
