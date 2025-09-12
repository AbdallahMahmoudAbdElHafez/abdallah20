// server/src/services/purchaseInvoiceItem.service.js

import { PurchaseInvoiceItem } from "../models/index.js";

class PurchaseInvoiceItemService {
    
  static async findAll(invoiceId) {
    return PurchaseInvoiceItem.findAll({ where: { purchase_invoice_id: invoiceId } });
  }

  static async findById(id) {
    return PurchaseInvoiceItem.findByPk(id);
  }

 static async create(data) {

    return await PurchaseInvoiceItem.create(data);
  }


static async update(id, data) {
  // ❌ برضه ما تبعتش total_price
  await PurchaseInvoiceItem.update(data, {
    where: { id },
    fields: [
      "batch_number",
      "expiry_date",
      "quantity",
      "bonus_quantity",
      "unit_price",
      "discount",
    ],
  });
  return PurchaseInvoiceItem.findByPk(id);
}


  static async delete(id) {
    return PurchaseInvoiceItem.destroy({ where: { id } });
  }
}

export default PurchaseInvoiceItemService;
