import { createJournalEntry } from "../services/journal.service.js";

export default function purchaseOrderHooks(sequelize) {
  const {
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseInvoice,
    PurchaseInvoiceItem,
    InventoryTransaction,
    ReferenceType,
    Account,
    Party
  } = sequelize.models;

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
          status: 'unpaid',
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
            source_id: it.id,
            batches: batches
          }, { transaction: t });
        }
      }

      // Create Journal Entry for Purchase Order
      try {
        // 1. Ensure Reference Type exists
        let refType = await ReferenceType.findOne({ where: { code: 'purchase_order' }, transaction: t });
        if (!refType) {
          refType = await ReferenceType.create({
            code: 'purchase_order',
            name: 'أمر شراء',
            label: 'أمر شراء',
            description: 'قيود أوامر الشراء'
          }, { transaction: t });
        }

        // حساب المخزون
        const inventoryAccount = await Account.findOne({
          where: { name: "المخزون" },
          transaction: t
        });

        if (inventoryAccount) {
          // حساب المورد
          const supplier = await Party.findByPk(order.supplier_id, { transaction: t });

          if (supplier?.account_id) {
            await createJournalEntry({
              refCode: "purchase_order",
              refId: order.id,
              entryDate: order.order_date || new Date(),
              description: `اعتماد أمر شراء #${order.order_number || order.id}`,
              lines: [
                { account_id: inventoryAccount.id, debit: order.total_amount, credit: 0, description: "إضافة للمخزون" },
                { account_id: supplier.account_id, debit: 0, credit: order.total_amount, description: "حساب المورد (أجل)" }
              ]
            }, { transaction: t });

            console.log(`Journal Entry created for Purchase Order #${order.id}`);
          } else {
            console.warn(`Supplier account not found for order #${order.id}. Skipping journal entry.`);
          }
        } else {
          console.warn("حساب 'المخزون' غير موجود. Skipping journal entry.");
        }
      } catch (error) {
        console.error("Error creating Journal Entry for Purchase Order:", error);
        // Don't throw - let the order processing continue even if journal entry fails
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
