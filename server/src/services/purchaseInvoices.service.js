// server/src/services/purchaseInvoices.service.js
import { PurchaseInvoice, Party, PurchaseOrder } from "../models/index.js";

class PurchaseInvoiceService {
static  async getAll() {
    return await PurchaseInvoice.findAll({
      include: [
        { model: Party, as: "supplier", attributes: ["id", "name"] },
        { model: PurchaseOrder, as: "purchase_order", attributes: ["id", "order_number"] },
      ],
    });
  }

static  async getById(id) {
    return await PurchaseInvoice.findByPk(id, {
      include: [
        { model: Party, as: "supplier", attributes: ["id", "name"] },
        { model: PurchaseOrder, as: "purchase_order", attributes: ["id", "order_number"] },
      ],
    });
  }

static  async create(data) {
    return await PurchaseInvoice.create(data);
  }

static  async update(id, data) {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new Error("PurchaseInvoice not found");
    return await invoice.update(data);
  }

static  async delete(id) {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new Error("PurchaseInvoice not found");
    return await invoice.destroy();
  }
}
export default PurchaseInvoiceService;
