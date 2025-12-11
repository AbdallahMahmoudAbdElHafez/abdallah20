import service from "../services/salesReturns.service.js";

export default {
    getAll: async (req, res) => {
        const data = await service.getAll();
        res.json(data);
    },

    getById: async (req, res) => {
        const item = await service.getById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not Found" });
        res.json(item);
    },

    create: async (req, res) => {
        const created = await service.create(req.body);
        res.status(201).json(created);
    },

    update: async (req, res) => {
        const updated = await service.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: "Not Found" });
        res.json(updated);
    },

    delete: async (req, res) => {
        const deleted = await service.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not Found" });
        res.json({ message: "Deleted" });
    }
};
