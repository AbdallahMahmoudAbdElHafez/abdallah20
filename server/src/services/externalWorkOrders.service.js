import {
ExternalWorkOrder,
ExternalWorkOrderMaterial,
ExternalWorkOrderReceipt,
InventoryTransaction,
Warehouse,
Product,
Party
} from '../models/index.js';

class ExternalWorkOrdersService {
// الحصول على جميع أوامر التشغيل الخارجية
static async getAll() {
return ExternalWorkOrder.findAll({
include: [
{ model: Party, as: 'supplier', attributes: ['id', 'name'] },
{ model: Product, as: 'product', attributes: ['id', 'name'] },
{ model: ExternalWorkOrderMaterial, as: 'materials', include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }] },
{ model: ExternalWorkOrderReceipt, as: 'receipts' }
],
order: [['created_at', 'DESC']]
});
}

// إنشاء أمر تشغيل خارجي مع خصم المواد من المخزون
static async create(data) {
return ExternalWorkOrder.sequelize.transaction(async (t) => {
const { materials, ...orderData } = data;
const order = await ExternalWorkOrder.create(orderData, { transaction: t });
  if (materials && materials.length > 0) {
    const prepared = materials.map((m) => ({ ...m, work_order_id: order.id }));
    await ExternalWorkOrderMaterial.bulkCreate(prepared, { transaction: t });

    // تسجيل حركات الصرف (out)
    const outTransactions = prepared.map((m) => ({
      product_id: m.product_id,
      warehouse_id: m.warehouse_id,
      transaction_type: 'out',
      quantity: m.quantity,
      cost_per_unit: m.cost_per_unit || 0,
      note: `صرف لمورد خارجي لأمر تشغيل رقم ${order.id}`,
    }));
    await InventoryTransaction.bulkCreate(outTransactions, { transaction: t });
  }

  return order;
});
}

// تسجيل استلام منتجات من أمر تشغيل خارجي (in)
static async receive(id, receipts) {
return ExternalWorkOrder.sequelize.transaction(async (t) => {
const order = await ExternalWorkOrder.findByPk(id, { transaction: t });
if (!order) throw new Error('External Work Order not found');
  const prepared = receipts.map((r) => ({ ...r, work_order_id: id }));
  await ExternalWorkOrderReceipt.bulkCreate(prepared, { transaction: t });

  // تسجيل حركات الاستلام (in)
  const inTransactions = prepared.map((r) => ({
    product_id: order.product_id,
    warehouse_id: r.warehouse_id,
    transaction_type: 'in',
    quantity: r.quantity,
    cost_per_unit: r.cost_per_unit || 0,
    note: `استلام من أمر تشغيل خارجي رقم ${id}`,
  }));

  await InventoryTransaction.bulkCreate(inTransactions, { transaction: t });

  return order;
});
}

static async delete(id) {
return ExternalWorkOrder.sequelize.transaction(async (t) => {
await ExternalWorkOrderMaterial.destroy({ where: { work_order_id: id }, transaction: t });
await ExternalWorkOrderReceipt.destroy({ where: { work_order_id: id }, transaction: t });
return ExternalWorkOrder.destroy({ where: { id }, transaction: t });
});
}
}

export default ExternalWorkOrdersService;