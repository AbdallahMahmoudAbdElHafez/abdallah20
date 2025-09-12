// server/src/controllers/purchaseInvoiceItem.controller.js

import response from "../utils/response.js";
import PurchaseInvoiceItemService from "../services/purchaseInvoiceItem.service.js";


class PurchaseInvoiceItemController {
  static async getAll(req, res, next) {
    try {
      const data = await PurchaseInvoiceItemService.findAll(req.params.invoiceId);
      return response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await PurchaseInvoiceItemService.findById(req.params.id);
      return response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res) {
    try {
      console.log(req.body);
      const item = await PurchaseInvoiceItemService.create(req.body);
      response.ok(res, item, 201);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res, next) {
    try {
      const data = await PurchaseInvoiceItemService.update(req.params.id, req.body);
      return response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const data = await PurchaseInvoiceItemService.delete(req.params.id);
      return response.ok(res, data);
    } catch (err) {
      next(err);
    }
  }

    static async getByOrder(req, res) {
    try {
      const { orderId } = req.params;
      const items = await purchaseOrderItemService.getByOrder(orderId);
      if (!items) return response.notFound(res, "Items not found");
      response.ok(res, items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default PurchaseInvoiceItemController;

