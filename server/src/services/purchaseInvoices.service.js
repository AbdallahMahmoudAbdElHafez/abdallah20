import { PurchaseInvoice, Party, PurchaseOrder } from "../models/index.js";
import { Op } from "sequelize";


class PurchaseInvoiceService {
  // ⬇️ تعديل الدالة لقبول فلتر اختياري
  static async getAll(purchaseOrderId = null) {
    const where = {};
    if (purchaseOrderId) {
      where.purchase_order_id = purchaseOrderId;
    }

    return await PurchaseInvoice.findAll({
      where,
      include: [
        { model: Party, as: "supplier", attributes: ["id", "name"] },
        { model: PurchaseOrder, as: "purchase_order", attributes: ["id", "order_number"] },
      ],
      order: [["id", "DESC"]],
    });
  }

  static async getById(id) {
    return await PurchaseInvoice.findByPk(id, {
      include: [
        { model: Party, as: "supplier", attributes: ["id", "name"] },
        { model: PurchaseOrder, as: "purchase_order", attributes: ["id", "order_number"] },
      ],
    });
  }

  static async create(data) {
    // Auto-generate invoice_number if not provided
    if (!data.invoice_number) {
      const year = new Date().getFullYear();
      const lastInvoice = await PurchaseInvoice.findOne({
        where: {
          invoice_number: {
            [Op.like]: `PI-${year}-%`
          }
        },
        order: [['id', 'DESC']]
      });

      let nextNumber = 1;
      if (lastInvoice) {
        const lastNumber = parseInt(lastInvoice.invoice_number.split('-')[2]);
        nextNumber = lastNumber + 1;
      }

      data.invoice_number = `PI-${year}-${String(nextNumber).padStart(6, '0')}`;
    }

    return await PurchaseInvoice.create(data);
  }

  static async update(id, data) {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new Error("PurchaseInvoice not found");
    return await invoice.update(data);
  }

  static async delete(id) {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new Error("PurchaseInvoice not found");
    return await invoice.destroy();
  }
}

export default PurchaseInvoiceService;
