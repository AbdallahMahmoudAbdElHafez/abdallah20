import service from "../services/salesOrderItems.service.js";

export default {
    getAll: async (req, res) => {
        try {
            if (req.query.sales_order_id) {
                const data = await service.getByOrderId(req.query.sales_order_id);
                return res.json(data);
            }
            const data = await service.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const item = await service.getById(req.params.id);
            if (!item) return res.status(404).json({ message: "Not Found" });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const created = await service.create(req.body);
            res.status(201).json(created);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const updated = await service.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ message: "Not Found" });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const deleted = await service.delete(req.params.id);
            if (!deleted) return res.status(404).json({ message: "Not Found" });
            res.json({ message: "Deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
