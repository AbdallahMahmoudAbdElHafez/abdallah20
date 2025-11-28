// src/services/warehouseTransfers.service.js
import { WarehouseTransfer, Warehouse, WarehouseTransferItem, InventoryTransaction } from '../models/index.js';
import InventoryTransactionService from './inventoryTransaction.service.js';
class WarehouseTransfersService {


  static async getAll() {
    return WarehouseTransfer.findAll({
      include: [
        { model: Warehouse, as: 'fromWarehouse', attributes: ['id', 'name'] },
        { model: Warehouse, as: 'toWarehouse', attributes: ['id', 'name'] },
        { model: WarehouseTransferItem, as: 'items' }
      ],
      order: [['transfer_date', 'DESC']],
    });
  }

  static async getById(id) {
    return WarehouseTransfer.findByPk(id, {
      include: [
        { model: Warehouse, as: 'fromWarehouse', attributes: ['id', 'name'] },
        { model: Warehouse, as: 'toWarehouse', attributes: ['id', 'name'] },
      ],
    });
  }

  static async create(data) {
    return WarehouseTransfer.sequelize.transaction(async (t) => {
      const { items, ...transferData } = data;
      const transfer = await WarehouseTransfer.create(transferData, { transaction: t });

      // جلب أسماء المخازن
      const [fromWarehouse, toWarehouse] = await Promise.all([
        Warehouse.findByPk(transfer.from_warehouse_id, { transaction: t }),
        Warehouse.findByPk(transfer.to_warehouse_id, { transaction: t }),
      ]);

      if (items && items.length > 0) {
        const prepared = items.map(i => ({ ...i, transfer_id: transfer.id }));
        await WarehouseTransferItem.bulkCreate(prepared, { transaction: t });

        for (const item of prepared) {
          const batches = [];
          if (item.batch_number && item.expiry_date) {
            batches.push({
              batch_number: item.batch_number,
              expiry_date: item.expiry_date,
              quantity: item.quantity,
              cost_per_unit: item.cost_per_unit
            });
          }

          // OUT from source
          await InventoryTransactionService.create({
            product_id: item.product_id,
            warehouse_id: transfer.from_warehouse_id,
            transaction_type: 'out',
            transaction_date: transfer.transfer_date,
            note: `تحويل إلى ${toWarehouse?.name || transfer.to_warehouse_id}`,
            source_type: 'transfer',
            source_id: transfer.id,
            batches: batches
          });

          // IN to destination
          await InventoryTransactionService.create({
            product_id: item.product_id,
            warehouse_id: transfer.to_warehouse_id,
            transaction_type: 'in',
            transaction_date: transfer.transfer_date,
            note: `تحويل من مخزن ${fromWarehouse?.name || transfer.from_warehouse_id}`,
            source_type: 'transfer',
            source_id: transfer.id,
            batches: batches
          });
        }
      }

      return transfer;
    });
  }


  static async update(id, data) {
    // Note: This implementation assumes we want to fully replace items and inventory transactions.
    // Ideally we should use a transaction, but InventoryTransactionService might not support passing a transaction object easily 
    // without modifying it. For now, we'll do it sequentially.

    const { items, ...transferData } = data;
    const transfer = await WarehouseTransfer.findByPk(id);
    if (!transfer) throw new Error('Transfer not found');

    // 1. Reverse old inventory transactions
    const oldTransactions = await InventoryTransaction.findAll({
      where: { source_type: 'transfer', source_id: id }
    });
    for (const trx of oldTransactions) {
      await InventoryTransactionService.remove(trx.id);
    }

    // 2. Update transfer details
    await transfer.update(transferData);

    // 3. Update items
    if (items) {
      await WarehouseTransferItem.destroy({ where: { transfer_id: id } });
      const prepared = items.map(i => ({ ...i, transfer_id: id }));
      await WarehouseTransferItem.bulkCreate(prepared);

      // 4. Create new inventory transactions
      const [fromWarehouse, toWarehouse] = await Promise.all([
        Warehouse.findByPk(transfer.from_warehouse_id),
        Warehouse.findByPk(transfer.to_warehouse_id),
      ]);

      for (const item of prepared) {
        const batches = [];
        if (item.batch_number && item.expiry_date) {
          batches.push({
            batch_number: item.batch_number,
            expiry_date: item.expiry_date,
            quantity: item.quantity,
            cost_per_unit: item.cost_per_unit
          });
        }

        // OUT from source
        await InventoryTransactionService.create({
          product_id: item.product_id,
          warehouse_id: transfer.from_warehouse_id,
          transaction_type: 'out',
          transaction_date: transfer.transfer_date,
          note: `تحويل إلى ${toWarehouse?.name || transfer.to_warehouse_id}`,
          source_type: 'transfer',
          source_id: transfer.id,
          batches: batches
        });

        // IN to destination
        await InventoryTransactionService.create({
          product_id: item.product_id,
          warehouse_id: transfer.to_warehouse_id,
          transaction_type: 'in',
          transaction_date: transfer.transfer_date,
          note: `تحويل من مخزن ${fromWarehouse?.name || transfer.from_warehouse_id}`,
          source_type: 'transfer',
          source_id: transfer.id,
          batches: batches
        });
      }
    }

    return transfer;
  }

  static async delete(id) {
    // Reverse inventory transactions first
    const oldTransactions = await InventoryTransaction.findAll({
      where: { source_type: 'transfer', source_id: id }
    });
    for (const trx of oldTransactions) {
      await InventoryTransactionService.remove(trx.id);
    }

    await WarehouseTransferItem.destroy({ where: { transfer_id: id } });
    return WarehouseTransfer.destroy({ where: { id } });
  }
}
export default WarehouseTransfersService;
