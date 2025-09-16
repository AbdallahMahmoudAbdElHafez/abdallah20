// hooks/purchaseOrderHooks.js
import {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseInvoice,
  PurchaseInvoiceItem,
} from "../models/index.js";

export default function purchaseOrderHooks() {
  // إنشاء فاتورة عند الموافقة على أمر الشراء
  PurchaseOrder.afterUpdate(async (order, options) => {
    if (order.changed("status") && order.status === "approved") {
      const t = options.transaction;

      // لو فيه فاتورة بالفعل نخرج
      const existing = await PurchaseInvoice.findOne({
        where: { purchase_order_id: order.id },
        transaction: t,
      });
      if (existing) return;

      // توليد رقم الفاتورة
      const year = new Date().getFullYear();
      const paddedId = String(order.id).padStart(6, "0");
      const invoiceNumber = `PI-${year}-${paddedId}`;

      // إنشاء رأس الفاتورة
      const invoice = await PurchaseInvoice.create(
        {
          supplier_id: order.supplier_id,
          purchase_order_id: order.id,
          invoice_number: invoiceNumber,
          invoice_date: new Date(),
          due_date: null,
          subtotal: order.subtotal,
          additional_discount: order.additional_discount,
          vat_rate: order.vat_rate,
          vat_amount: order.vat_amount,
          tax_rate: order.tax_rate,
          tax_amount: order.tax_amount,
          total_amount: order.total_amount,
        },
        { transaction: t }
      );

      // 🟢 نسخ العناصر من purchase_order_items إلى purchase_invoice_items
      const orderItems = await PurchaseOrderItem.findAll({
        where: { purchase_order_id: order.id },
        transaction: t,
      });

      if (orderItems.length) {
        const invoiceItemsData = orderItems.map((it) => ({
          purchase_invoice_id: invoice.id,
          product_id: it.product_id,
          warehouse_id: it.warehouse_id,
          batch_number: it.batch_number,
          expiry_date: it.expiry_date,
          quantity: it.quantity,
          bonus_quantity: it.bonus_quantity,
          unit_price: it.unit_price,
          discount: it.discount,
          total_price: it.total_price,
        }));
        await PurchaseInvoiceItem.bulkCreate(invoiceItemsData, { transaction: t });
      }
    }
  });

  // توليد order_number لأمر الشراء
  PurchaseOrder.afterCreate(async (order, options) => {
    if (!order.order_number) {
      const year = new Date().getFullYear();
      const paddedId = String(order.id).padStart(6, "0");
      const generated = `PO-${year}-${paddedId}`;
      await order.update({ order_number: generated }, { transaction: options.transaction });
    }
  });
}
