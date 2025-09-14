import response from "../utils/response.js";
import PurchaseInvoiceService from "../services/purchaseInvoices.service.js";

class PurchaseInvoiceController {
  static async getAll(req, res, next) {
    try {
      // 👇 قراءة purchase_order_id لو موجود في الـ Query String
      const { purchase_order_id } = req.query;
      const data = await PurchaseInvoiceService.getAll(purchase_order_id);
      response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await PurchaseInvoiceService.getById(req.params.id);
      if (!data) return response.notFound(res, "Invoice not found", 404);
      response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const invoice = await PurchaseInvoiceService.create(req.body);
      response.ok(res, invoice, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await PurchaseInvoiceService.update(req.params.id, req.body);
      response.ok(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await PurchaseInvoiceService.delete(req.params.id);
      response.ok(res, { message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default PurchaseInvoiceController;
