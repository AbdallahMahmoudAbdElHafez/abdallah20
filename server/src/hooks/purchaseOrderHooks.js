import {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseInvoice,
  PurchaseInvoiceItem,
  InventoryTransaction,
} from "../models/index.js";

export default function purchaseOrderHooks() {
  PurchaseOrder.afterUpdate(async (order, options) => {
    if (order.changed("status") && order.status === "approved") {
      const t = options.transaction;

      const existing = await PurchaseInvoice.findOne({
        where: { purchase_order_id: order.id },
        transaction: t,
      });
      if (existing) return;

      const year = new Date().getFullYear();
      const paddedId = String(order.id).padStart(6, "0");
      const invoiceNumber = `PI-${year}-${paddedId}`;

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

        const createdItems = await PurchaseInvoiceItem.bulkCreate(invoiceItemsData, { transaction: t });

        // ✅ إضافة الأصناف للمخزون باستخدام Service لضمان تحديث الرصيد والباتشات
        // نحتاج لاستيراد Service أولاً
        const InventoryTransactionService = (await import("../services/inventoryTransaction.service.js")).default;

        for (const it of createdItems) {
          const totalQty = Number(it.quantity) + Number(it.bonus_quantity || 0);

          // تجهيز بيانات الباتش - دائماً نرسل batch حتى بدون batch_number/expiry_date
          const batches = [{
            batch_number: it.batch_number || null,
            expiry_date: it.expiry_date || null,
            quantity: totalQty,
            cost_per_unit: Number(it.unit_price)
          }];

          await InventoryTransactionService.create({
            product_id: it.product_id,
            warehouse_id: it.warehouse_id,
            transaction_type: "in",
            transaction_date: new Date(),
            note: `Added from Purchase Invoice ${invoiceNumber}`,
            source_type: 'purchase',
            source_id: it.id, // Use Item ID
            batches: batches
          }, { transaction: t }); // Service handles CurrentInventory update
        }
      }
    }
  });

  PurchaseOrder.afterCreate(async (order, options) => {
    if (!order.order_number) {
      const year = new Date().getFullYear();
      const paddedId = String(order.id).padStart(6, "0");
      const generated = `PO-${year}-${paddedId}`;
      await order.update({ order_number: generated }, { transaction: options.transaction });
    }
  });
}
