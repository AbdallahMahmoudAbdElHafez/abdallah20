import BatchInventoryService from "../services/batchInventory.service.js";

class BatchInventoryController {
    static async getAll(req, res) {
        try {
            const batchInventories = await BatchInventoryService.getAll();
            res.json(batchInventories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByBatch(req, res) {
        try {
            const { batchId } = req.params;
            const batchInventories = await BatchInventoryService.getByBatch(batchId);
            res.json(batchInventories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByWarehouse(req, res) {
        try {
            const { warehouseId } = req.params;
            const batchInventories = await BatchInventoryService.getByWarehouse(warehouseId);
            res.json(batchInventories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default BatchInventoryController;
