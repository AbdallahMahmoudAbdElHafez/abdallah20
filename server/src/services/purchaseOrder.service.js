// services/purchaseOrder.service.js
import { PurchaseOrder, PurchaseOrderItem } from "../models/index.js"; // يفترض استخدام Sequelize أو ORM مشابه

class PurchaseOrderService {
  static async getAll() {
    return PurchaseOrder.findAll({
      include: { model: PurchaseOrderItem, as: "items" },
    });
  }

  static async getById(id) {
    return PurchaseOrder.findByPk(id, {
      include: { model: PurchaseOrderItem, as: "items" },
    });
  }

  static async create(data) {
    // تحويل القيم الرقمية للتأكد من صحة الحسابات
    const items = (data.items || []).map((it) => ({
      ...it,
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
      discount: Number(it.discount || 0), // discount كنسبة مئوية لكل item
    }));

    const additionalDiscount = Number(data.additional_discount || 0); // قيمة خصم إضافي ثابتة (بالعملة)
    const taxPercent = Number(data.tax_percent || 0);
    const vatRate = Number(data.vat_rate || 0);

    // حساب الإجمالى بعد خصم نسبة كل صنف
    const subTotal = items.reduce((sum, it) => {
      const itemPrice = it.quantity * it.unit_price;
      const itemDiscountValue = (itemPrice * it.discount) / 100;
      return sum + (itemPrice - itemDiscountValue);
    }, 0);

    const taxAmount = (subTotal - additionalDiscount) * (taxPercent / 100);
    const vatAmount = (subTotal - additionalDiscount) * (vatRate / 100);
    const totalAmount = subTotal - additionalDiscount + taxAmount + vatAmount;

    const purchaseOrder = await PurchaseOrder.create({
      ...data,
      subtotal: subTotal,
      additional_discount: additionalDiscount,
      tax_rate: taxPercent,
      tax_amount: taxAmount,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total_amount: totalAmount,
    });

    // حفظ الـ Items
    for (const it of items) {
      await PurchaseOrderItem.create({
        ...it,
        purchase_order_id: purchaseOrder.id,
      });
    }

    return this.getById(purchaseOrder.id);
  }

  static async updateWithItems(id, data) {
    const items = (data.items || []).map((it) => ({
      ...it,
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
      discount: Number(it.discount || 0),
    }));

    const additionalDiscount = Number(data.additional_discount || 0);
    const taxPercent = Number(data.tax_percent || 0);
    const vatRate = Number(data.vat_rate || 0);

    const purchaseOrder = await PurchaseOrder.findByPk(id);
    if (!purchaseOrder) throw new Error("Purchase order not found");

    const subTotal = items.reduce((sum, it) => {
      const itemPrice = it.quantity * it.unit_price;
      const itemDiscountValue = (itemPrice * it.discount) / 100;
      return sum + (itemPrice - itemDiscountValue);
    }, 0);

    const taxAmount = (subTotal - additionalDiscount) * (taxPercent / 100);
    const vatAmount = (subTotal - additionalDiscount) * (vatRate / 100);
    const totalAmount = subTotal - additionalDiscount + taxAmount + vatAmount;

    await purchaseOrder.update({
      ...data,
      subtotal: subTotal,
      additional_discount: additionalDiscount,
      tax_rate: taxPercent,
      tax_amount: taxAmount,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total_amount: totalAmount,
    });

    // حذف الأصناف القديمة ثم إضافة الجديدة
    await PurchaseOrderItem.destroy({ where: { purchase_order_id: id } });

    for (const it of items) {
      await PurchaseOrderItem.create({
        ...it,
        purchase_order_id: id,
      });
    }

    return this.getById(id);
  }

  static async delete(id) {
    const purchaseOrder = await PurchaseOrder.findByPk(id);
    if (!purchaseOrder) return null;

    await PurchaseOrderItem.destroy({ where: { purchase_order_id: id } });
    await purchaseOrder.destroy();
    return purchaseOrder;
  }
}

export default PurchaseOrderService;
