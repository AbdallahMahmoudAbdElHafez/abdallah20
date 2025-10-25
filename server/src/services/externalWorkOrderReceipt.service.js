import { ExternalWorkOrderReceipt, Product, Warehouse, InventoryTransaction } from '../models/index.js';

class ExternalWorkOrderReceiptService {
static async getAll() {
return ExternalWorkOrderReceipt.findAll({
include: [
{ model: Product, as: 'product', attributes: ['id', 'name', 'sku'] },
{ model: Warehouse, as: 'warehouse', attributes: ['id', 'name'] }
],
order: [['id', 'DESC']]
});
}

static async create(data) {
return ExternalWorkOrderReceipt.sequelize.transaction(async (t) => {
const receipt = await ExternalWorkOrderReceipt.create(data, { transaction: t });
  await InventoryTransaction.create({
    product_id: receipt.product_id,
    warehouse_id: receipt.warehouse_id,
    transaction_type: 'in',
    quantity: receipt.quantity,
    cost_per_unit: receipt.cost_per_unit,
    note: `استلام من مورد خارجي (أمر تشغيل ${receipt.external_work_order_id})`
  }, { transaction: t });

  return receipt;
});
}

static async delete(id) {
return ExternalWorkOrderReceipt.destroy({ where: { id } });
}
}

export default ExternalWorkOrderReceiptService;