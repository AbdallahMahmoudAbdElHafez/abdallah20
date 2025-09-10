
import { PurchaseOrderItem, Product } from "../models/index.js";

class PurchaseOrderItemService {


 static async getById(id) {
    return await PurchaseOrderItem.findByPk(id, {
      include: [{ model: Product, attributes: ["id", "name", "sku"] }],
    });
  }

 static async create(data) {
    return await PurchaseOrderItem.create(data);
  }

 static async update(id, data) {
    const item = await PurchaseOrderItem.findByPk(id);
    if (!item) throw new Error("Purchase Order Item not found");
    return await item.update(data);
  }

static  async delete(id) {
    const item = await PurchaseOrderItem.findByPk(id);
    if (!item) throw new Error("Purchase Order Item not found");
    return await item.destroy();
  }
  
 static async getByOrder(orderId) {
    
    return await PurchaseOrderItem.findAll({
      where: { purchase_order_id: orderId },
    });
  }
}

export default PurchaseOrderItemService
