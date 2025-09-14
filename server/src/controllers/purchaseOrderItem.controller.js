import purchaseOrderItemService from "../services/purchaseOrderItem.service.js";
import response from "../utils/response.js";

class PurchaseOrderItemController {
  static async getAll(req, res) {
    try {
      const items = await purchaseOrderItemService.getAll();
      return response.ok(res, items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const item = await purchaseOrderItemService.create(req.body);
      return response.ok(res, item, 201);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await purchaseOrderItemService.getById(id);
      if (!item) return response.notFound(res, "Item not found");
      return response.ok(res, item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const item = await purchaseOrderItemService.update(id, req.body);
      if (!item) return response.notFound(res, "Item not found");
      return response.ok(res, item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await purchaseOrderItemService.delete(id);
      if (!deleted) return response.notFound(res, "Item not found");
      return response.ok(res, { message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async getByOrder(req, res) {
    try {
      const { orderId } = req.params;
      const items = await purchaseOrderItemService.getByOrder(orderId);
      // حتى لو فاضي، نرجعه كمصفوفة
      return response.ok(res, items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export default PurchaseOrderItemController;
