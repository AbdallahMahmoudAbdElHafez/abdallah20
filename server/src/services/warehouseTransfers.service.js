// src/services/warehouseTransfers.service.js
import { WarehouseTransfer,Warehouse,WarehouseTransferItem ,InventoryTransaction} from '../models/index.js';
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

      // سجل الحركات بملاحظات توضح اسم المخزن
      const outTransactions = prepared.map(i => ({
        product_id: i.product_id,
        warehouse_id: transfer.from_warehouse_id,
        transaction_type: 'out',
        quantity: i.quantity,
        cost_per_unit: i.cost_per_unit,
        note: `تحويل إلى  ${toWarehouse?.name || transfer.to_warehouse_id}`,
        transaction_date: transfer.transfer_date,
      }));

      const inTransactions = prepared.map(i => ({
        product_id: i.product_id,
        warehouse_id: transfer.to_warehouse_id,
        transaction_type: 'in',
        quantity: i.quantity,
        cost_per_unit: i.cost_per_unit,
        note: `تحويل من مخزن ${fromWarehouse?.name || transfer.from_warehouse_id}`,
        transaction_date: transfer.transfer_date,
      }));

      await InventoryTransaction.bulkCreate([...outTransactions, ...inTransactions], { transaction: t });
    }

    return transfer;
  });
}


static  async update(id, data) {
    return WarehouseTransfer.sequelize.transaction(async (t) => {
    const { items, ...transferData } = data;
    const transfer = await WarehouseTransfer.findByPk(id, { transaction: t });
    if (!transfer) throw new Error('Transfer not found');

    await transfer.update(transferData, { transaction: t });

    if (items) {
      await WarehouseTransferItem.destroy({ where: { transfer_id: id }, transaction: t });
      const prepared = items.map(i => ({ ...i, transfer_id: id }));
      await WarehouseTransferItem.bulkCreate(prepared, { transaction: t });
    }

    return transfer;
  });
  }

 static async delete(id) {
    return WarehouseTransfer.sequelize.transaction(async (t) => {
      await WarehouseTransferItem.destroy({ where: { transfer_id: id }, transaction: t });
      return WarehouseTransfer.destroy({ where: { id }, transaction: t });
    });
  }
}
export default WarehouseTransfersService;
