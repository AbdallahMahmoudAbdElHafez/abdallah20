import WarehouseInventoryService from "../services/warehouseInventory.service.js";
import response from "../utils/response.js";

class WarehouseInventoryController {
    static async getProducts(req, res, next) {
        try {
            const { warehouseId } = req.params;
            const data = await WarehouseInventoryService.getProductsByWarehouse(warehouseId);
            return response.ok(res, data);
        } catch (err) {
            next(err);
        }
    }

    static async getBatches(req, res, next) {
        try {
            const { warehouseId, productId } = req.params;
            const data = await WarehouseInventoryService.getBatchesByProductAndWarehouse(warehouseId, productId);
            return response.ok(res, data);
        } catch (err) {
            next(err);
        }
    }
}

export default WarehouseInventoryController;
