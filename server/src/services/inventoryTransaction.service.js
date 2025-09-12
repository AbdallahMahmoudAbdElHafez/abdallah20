// services/inventoryTransaction.service.js
import { InventoryTransaction,Product,Warehouse } from "../models/index.js";
class InventoryTransactionService {
    static async getByAll() {
        return await InventoryTransaction.findAll({
            include: [
                { model: Product, as: "product" },
                { model: Warehouse, as: "warehouse" },
            ],
            order: [["transaction_date", "DESC"]],
        });
    }
    static async getById(id) {
        return await InventoryTransaction.findByPk(id, {
            include: [
                { model: Product, as: "product" },
                { model: Warehouse, as: "warehouse" },
            ],
        });
    }
    static async create(data) {
        return await InventoryTransaction.create(data);
    }
    static async update(id, data) {
        const trx = await InventoryTransaction.findByPk(id);
        if (!trx) throw new Error("Transaction not found");
        return await trx.update(data);
    }
    static async remove(id) {
        const trx = await InventoryTransaction.findByPk(id);
        if (!trx) throw new Error("Transaction not found");
        await trx.destroy();
        return true;
    }
}
export default  InventoryTransactionService;
