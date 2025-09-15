import response from "../utils/response.js";
import PurchaseOrderService from "../services/purchaseOrder.service.js";

class PurchaseOrderController {
  static async getAll(req, res, next) {
    try {
        const purchaseOrders = await PurchaseOrderService.getAll();
        response.ok(res, purchaseOrders);
    } catch (err) {
        next(err);
    }   
    }
    static async create(req, res, next) {
        console.log(req.body);
    try {
        
        const purchaseOrder = await PurchaseOrderService.create(req.body);
        response.ok(res, purchaseOrder, 201);
    } catch (err) {
        next(err);
    }
    }
    static async getById(req, res, next) {
    try {
        const purchaseOrder = await PurchaseOrderService.getById(req.params.id);
        if (!purchaseOrder) return response.notFound(res, "Purchase order not found");
        response.ok(res, purchaseOrder);
    }
    catch (err) {
        next(err);
    }
    }
    static async update(req, res, next) {
    try {
        const purchaseOrder = await PurchaseOrderService.updateWithItems(req.params.id, req.body);
        response.ok(res, purchaseOrder);
    } catch (err) {
        next(err);
    }
    }
    static async delete(req, res, next) {
    try {
        const purchaseOrder = await PurchaseOrderService.delete(req.params.id);
        if (!purchaseOrder) return response.notFound(res, "Purchase order not found");
        response.ok(res, { message: "Purchase order deleted" });
    } catch (err) {
        next(err);
    }
    }
}

export default PurchaseOrderController;
