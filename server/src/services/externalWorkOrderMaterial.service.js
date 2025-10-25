import { ExternalWorkOrderMaterial, Product, Warehouse, InventoryTransaction } from '../models/index.js';

class ExternalWorkOrderMaterialService {
static async getAll() {
return ExternalWorkOrderMaterial.findAll({
include: [
{ model: Product, as: 'material', attributes: ['id', 'name', 'sku'] },
{ model: Warehouse, as: 'warehouse', attributes: ['id', 'name'] }
],
order: [['id', 'DESC']]
});
}

static async create(data) {
return ExternalWorkOrderMaterial.sequelize.transaction(async (t) => {
const material = await ExternalWorkOrderMaterial.create(data, { transaction: t });
  await InventoryTransaction.create({
    product_id: material.material_id,
    warehouse_id: material.warehouse_id,
    transaction_type: 'out',
    quantity: material.quantity,
    cost_per_unit: material.cost_per_unit,
    note: `صرف لمورد خارجي (أمر تشغيل ${material.external_work_order_id})`
  }, { transaction: t });

  return material;
});
}

static async delete(id) {
return ExternalWorkOrderMaterial.destroy({ where: { id } });
}
}

export default ExternalWorkOrderMaterialService;