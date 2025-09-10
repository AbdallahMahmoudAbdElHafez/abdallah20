import { PurchaseOrder, PurchaseOrderItem, Party } from "../models/index.js";

class PurchaseOrderService {
    static async getAll() {
        return await PurchaseOrder.findAll({ include: [{ model: PurchaseOrderItem, as: 'items' }] });
    }
    static async getById(id) {
        return await PurchaseOrder.findByPk(id, { include: [{ model: PurchaseOrderItem, as: 'items' }] });
    }
    static async create(data) {
        return await PurchaseOrder.create(data, {
            include: [

                { model: PurchaseOrderItem, as: "items" }, // ← مهم
            ],
        });
    }
    static async update(id, data) {
        const po = await PurchaseOrder.findByPk(id);
        if (!po) throw new Error("Purchase order not found");
        return await po.update(data);
    }
    static async delete(id) {
        return await PurchaseOrder.destroy({ where: { id } });
    }
}

export default PurchaseOrderService;
