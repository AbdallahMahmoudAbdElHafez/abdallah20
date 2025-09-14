import { PurchaseOrder, PurchaseOrderItem, Party,PurchaseInvoice,PurchaseInvoiceItem } from "../models/index.js";
import { sequelize } from '../models/index.js';

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
   static async updateWithItems(id, data) {
    return await sequelize.transaction(async (t) => {
      const po = await PurchaseOrder.findByPk(id, {
        include: [{ model: PurchaseOrderItem, as: "items" }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      if (!po) throw new Error("Purchase order not found");

      const oldStatus = po.status;

      // تحديث الهيدر
      await po.update(data, { transaction: t });

      // حذف الأصناف القديمة
      await PurchaseOrderItem.destroy({ where: { purchase_order_id: id }, transaction: t });

      // إدخال الأصناف الجديدة
      const cleanItems = (data.items || []).map(({ id: _oldId, total_price, ...rest }) => ({
        ...rest,
        purchase_order_id: id,
      }));
      if (cleanItems.length) {
        await PurchaseOrderItem.bulkCreate(cleanItems, { transaction: t });
      }

      // ✅ لو تغيّرت الحالة من أي شيء آخر إلى approved ننشئ الفاتورة
      if (data.status === "approved" && oldStatus !== "approved") {
        // 1) إنشاء الفاتورة
        const invoice = await PurchaseInvoice.create({
          supplier_id: po.supplier_id,
          purchase_order_id: po.id,
          invoice_number: `AUTO-${po.order_number}`,
          invoice_date: new Date(),
          status: "unpaid",
          subtotal: po.total_amount,
          total_amount: po.total_amount,
          vat_rate: 0,
          vat_amount: 0,
          tax_rate: 0,
          tax_amount: 0
        }, { transaction: t });

        // 2) نسخ الأصناف من الـ Order
        const orderItems = await PurchaseOrderItem.findAll({
          where: { purchase_order_id: po.id },
          transaction: t
        });

        const invoiceItems = orderItems.map(item => ({
          purchase_invoice_id: invoice.id,
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          batch_number: item.batch_number,
          expiry_date: item.expiry_date,
          quantity: item.quantity,
          bonus_quantity: item.bonus_quantity,
          unit_price: item.unit_price,
          discount: item.discount
        }));

        if (invoiceItems.length) {
          await PurchaseInvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }
      }

      return await PurchaseOrder.findByPk(id, {
        include: [{ model: PurchaseOrderItem, as: "items" }],
        transaction: t
      });
    });
  }
    static async delete(id) {
        return await PurchaseOrder.destroy({ where: { id } });
    }
}

export default PurchaseOrderService;
