import purchaseOrderItemService from "../services/purchaseOrderItem.service.js";
import response from "../utils/response.js";

class PurchaseOrderItemController {
  static async getAll(req, res) {
    try {
      const items = await purchaseOrderItemService.getAll();
      response.ok(res, items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async create(req, res) {
    try {
      const item = await purchaseOrderItemService.create(req.body);
      response.ok(res, item, 201);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await purchaseOrderItemService.getById(id);
      if (!item) return response.notFound(res, "Item not found");
      response.ok(res, item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async update(req, res) {
    try {
      const { id } = req.params;
      const item = await purchaseOrderItemService.update(id, req.body);
      if (!item) return response.notFound(res, "Item not found");
      response.ok(res, item);
    }
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await purchaseOrderItemService.delete(id);
      if (!item) return response.notFound(res, "Item not found");
      response.ok(res, { message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
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

export default PurchaseOrderItemController;
