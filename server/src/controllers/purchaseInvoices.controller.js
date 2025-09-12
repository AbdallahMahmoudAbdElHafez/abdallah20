// server/src/controllers/purchaseInvoices.controller.js
import response from "../utils/response.js";
import PurchaseInvoiceService from "../services/purchaseInvoices.service.js";

class PurchaseInvoiceController {
static  async getAll(req, res) {
    try {
      const data = await PurchaseInvoiceService.getAll();
      response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

static  async getById(req, res) {
    try {
      const data = await PurchaseInvoiceService.getById(req.params.id);
      if (!data) return response.notFound(res, "Invoice not found", 404);
      response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

static  async create(req, res) {
    try {
      const invoice = await PurchaseInvoiceService.create(req.body);
      response.ok(res, invoice, 201);
    } catch (err) {
       return response.notFound(res, "Item not found");
    }
  }

static  async update(req, res) {
    try {
      const updated = await PurchaseInvoiceService.update(req.params.id, req.body);
      response.ok(res, updated);
    } catch (err) {
      next(err);
    }
  }

static  async delete(req, res) {
    try {
      await service.delete(req.params.id);
      response.ok(res, { message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default PurchaseInvoiceController;
