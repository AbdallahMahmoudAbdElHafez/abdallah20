// src/controllers/serviceTypes.controller.js
import ServiceTypesService from "../services/serviceTypes.service.js";

const ServiceTypesController = {
    getAll: async (req, res) => {
        try {
            const types = await ServiceTypesService.getAll();
            res.json(types);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const type = await ServiceTypesService.getById(req.params.id);
            if (!type) return res.status(404).json({ error: "Service type not found" });
            res.json(type);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const type = await ServiceTypesService.create(req.body);
            res.status(201).json(type);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const type = await ServiceTypesService.update(req.params.id, req.body);
            if (!type) return res.status(404).json({ error: "Service type not found" });
            res.json(type);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const result = await ServiceTypesService.remove(req.params.id);
            if (!result) return res.status(404).json({ error: "Service type not found" });
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default ServiceTypesController;
